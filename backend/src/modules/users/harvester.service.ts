import { Repository, Brackets } from 'typeorm';
import { Harvester } from '../members/harvester.entity';
import { User } from './user.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { HarvesterXlsxService } from './harvester-xlsx.service';
import { AWS3 } from '../../aws/aws.service';

export class HarvesterService {
  constructor(
    @Inject('HARVESTER_REPOSITORY')
    private readonly harvesterRepository: Repository<Harvester>,
    private readonly S3: AWS3,
    private readonly xlsxService: HarvesterXlsxService,
  ) {}

  async exists(
    code: string,
    member_id: number,
    harvester_id?: number,
  ): Promise<boolean> {
    console.log('checking for', code, member_id, harvester_id);

    let harvesters = this.harvesterRepository
      .createQueryBuilder('harvester')
      .where('harvester.code = :code', { code: code })
      .andWhere('harvester.member_id = :member_id', { member_id: member_id });

    if (harvester_id) {
      harvesters = harvesters.andWhere('harvester.id <> :harvester_id', {
        harvester_id: harvester_id,
      });
    }

    return (await harvesters.getMany()).length > 0;
  }

  async findAll(user: User): Promise<Harvester[]> {
    return await this.harvesterRepository
      .createQueryBuilder('harvester')
      .innerJoinAndSelect('harvester.zone', 'zone')
      .where('harvester.member_id = :memberId', { memberId: user.member_id })
      .andWhere('zone.id = harvester.zone_id')
      .getMany();
  }

  async saveFiles(harvester: Harvester, files: Array<Express.Multer.File>) {
    if (files) {
      try {
        const response = await Promise.all(
          files.map(async (file) => {
            const propValue = harvester[file.fieldname];

            const data = await this.S3.uploadFile(
              file,
              this.S3.getFileName(propValue),
            );

            if (data) {
              harvester[file.fieldname] = data;
            }

            return data;
          }),
        );

        return response;
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async create(
    harvester: Harvester,
    user: User,
    files: Array<Express.Multer.File>,
  ): Promise<Harvester> {
    const existingHarvester = await this.harvesterRepository
      .createQueryBuilder('harvester')
      .where('harvester.id = :id', { id: harvester.id })
      .andWhere('harvester.member_id = :memberId', { memberId: user.member_id })
      .getOne();

    if (existingHarvester) {
      throw new BadRequestException('Harvester Already exists');
    }

    if (await this.exists(harvester.code, user.member_id)) {
      throw new BadRequestException('Code already exists');
    }

    try {
      await this.saveFiles(harvester, files);
    } catch (error) {
      throw new Error(error);
    }

    harvester.member_id = user.member_id;

    return await this.harvesterRepository.save(harvester);
  }

  async update(
    id: number,
    harvester: Harvester,
    user: User,
    files: Array<Express.Multer.File>,
  ): Promise<Harvester> {
    if (await this.exists(harvester.code, user.member_id, id)) {
      throw new BadRequestException('Code already exists');
    }

    const existingHarvester = await this.harvesterRepository.findOne({
      where: { member_id: user.member_id, id },
    });

    if (!existingHarvester) {
      throw new BadRequestException('Harvester Already does not exists');
    }

    try {
      await this.saveFiles(harvester, files);
    } catch (error) {
      throw new Error(error);
    }

    return await this.harvesterRepository.save({
      ...existingHarvester,
      ...harvester,
    });
  }

  async delete(id: number, user: User): Promise<void> {
    const harvester = await this.harvesterRepository
      .createQueryBuilder('harvester')
      .where('harvester.id = :id', { id })
      .andWhere('harvester.member_id = :memberId', { memberId: user.member_id })
      .getOneOrFail();

    try {
      if (harvester.image) {
        await this.S3.deleteFile(this.S3.getFileName(harvester.image)).catch(
          (err) => console.error(err),
        );
      }

      if (harvester.contract_file) {
        await this.S3.deleteFile(
          this.S3.getFileName(harvester.contract_file),
        ).catch((err) => console.error(err));
      }
    } catch (error) {
      throw new Error(error);
    }

    await this.harvesterRepository.softDelete({
      id,
      member_id: user.member_id,
    });
  }

  async exportToExcel(user: User, lang: Language): Promise<ExcelJS.Buffer> {
    const harvesters = await this.harvesterRepository
      .createQueryBuilder('harvester')
      .leftJoinAndSelect('harvester.zone', 'zone')
      .where('harvester.member_id = :memberId', { memberId: user.member_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('zone.id = harvester.zone_id').orWhere(
            'harvester.zone_id IS NULL',
          );
        }),
      )
      .getMany();

    return this.xlsxService.export(harvesters, lang);
  }
}
