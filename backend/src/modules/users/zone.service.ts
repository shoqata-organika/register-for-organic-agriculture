import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { AWS3 } from '../../aws/aws.service';
import { Language } from '../../localization';
import { ZoneXlsxService } from './zone-xlsx.service';
import * as ExcelJS from 'exceljs';
import { Zone } from '../members/zone.entity';

export class ZoneService {
  constructor(
    @Inject('ZONE_REPOSITORY')
    private readonly zoneRepo: Repository<Zone>,
    private readonly S3: AWS3,
    private readonly xlsxService: ZoneXlsxService,
  ) {}

  async exists(
    code: string,
    member_id: number,
    zone_id?: number,
  ): Promise<boolean> {
    let zones = this.zoneRepo
      .createQueryBuilder('zone')
      .where('zone.code = :code', { code: code })
      .andWhere('zone.member_id = :member_id', { member_id: member_id });

    if (zone_id) {
      zones = zones.andWhere('zone.id <> :zone_id', {
        zone_id: zone_id,
      });
    }

    return (await zones.getMany()).length > 0;
  }

  async findAll(user: User): Promise<Zone[]> {
    return await this.zoneRepo.find({
      where: { member_id: user.member_id },
    });
  }

  async create(
    zone: Zone,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Zone> {
    const existingZone = await this.zoneRepo
      .createQueryBuilder('zone')
      .where('zone.id = :id', { id: zone.id })
      .andWhere('zone.member_id = :memberId', { memberId: user.member_id })
      .getOne();

    if (existingZone) {
      throw new BadRequestException('Zone already exists');
    }

    if (await this.exists(zone.code, user.member_id)) {
      throw new BadRequestException('Code already exists');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(file);

        zone.file = response ? response : null;
      } catch (error) {
        throw new Error(error);
      }
    }

    zone.member_id = user.member_id;

    return await this.zoneRepo.save(zone);
  }

  async update(
    id: number,
    zone: Zone,
    user: User,
    file?: Express.Multer.File,
  ): Promise<Zone> {
    if (await this.exists(zone.code, user.member_id, id)) {
      throw new BadRequestException('Code already exists');
    }

    const existingZone = await this.zoneRepo.findOne({
      where: { member_id: user.member_id, id },
    });

    if (!existingZone) {
      throw new BadRequestException('Zone does not exists');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(
          file,
          this.S3.getFileName(existingZone.file),
        );

        if (response) zone.file = response;
      } catch (error) {
        throw new Error(error);
      }
    }

    return await this.zoneRepo.save({
      ...existingZone,
      ...zone,
    });
  }

  async delete(id: number, user: User): Promise<void> {
    const zone = await this.zoneRepo
      .createQueryBuilder('zone')
      .where('zone.id = :id', { id })
      .andWhere('zone.member_id = :memberId', {
        memberId: user.member_id,
      })
      .select(['zone.file'])
      .getOneOrFail();

    if (zone.file) {
      try {
        await this.S3.deleteFile(this.S3.getFileName(zone.file));
      } catch (error) {
        throw new Error(error);
      }
    }

    await this.zoneRepo.delete({
      id,
      member_id: user.member_id,
    });
  }

  async exportToExcel(user: User, lang: Language): Promise<ExcelJS.Buffer> {
    const zones = await this.findAll(user);

    return this.xlsxService.export(zones, lang);
  }
}
