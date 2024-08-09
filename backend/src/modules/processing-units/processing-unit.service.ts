import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { ProcessingUnit } from './processing-unit.entity';
import { AWS3 } from '../../aws/aws.service';
import { ProcessingUnitXlsxService } from './processing-unit-xlsx.service';
import { User } from '../users/user.entity';

@Injectable()
export class ProcessingUnitService {
  constructor(
    @Inject('PROCESSING_UNIT_REPOSITORY')
    private readonly pUnitRepo: Repository<ProcessingUnit>,
    private readonly S3: AWS3,
    private readonly xlsxService: ProcessingUnitXlsxService,
  ) {}

  async findAll(user: User): Promise<ProcessingUnit[]> {
    return await this.pUnitRepo.find({
      where: { member_id: user.member_id },
    });
  }

  async create(
    processingUnit: Partial<ProcessingUnit>,
    user: User,
    file: Express.Multer.File,
  ): Promise<ProcessingUnit> {
    const existingP_Unit = await this.pUnitRepo
      .createQueryBuilder('pUnit')
      .where('pUnit.id = :id', { id: processingUnit.id })
      .andWhere('pUnit.member_id = :memberId', { memberId: user.member_id })
      .getOne();

    if (existingP_Unit) {
      throw new BadRequestException('Processing Unit already exists');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(file);

        processingUnit.file = response ? response : null;
      } catch (error) {
        throw new Error(error);
      }
    }

    processingUnit.member_id = user.member_id;

    return await this.pUnitRepo.save(processingUnit);
  }

  async update(
    id: number,
    processingUnit: Partial<ProcessingUnit>,
    user: User,
    file: Express.Multer.File | undefined,
  ) {
    const p_Unit = await this.pUnitRepo.findOne({
      where: { member_id: user.member_id, id },
    });

    if (!p_Unit) {
      return new NotFoundException('Processing Unit not found');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(
          file,
          this.S3.getFileName(p_Unit.file),
        );

        if (response) p_Unit.file = response;
      } catch (error) {
        throw new Error(error);
      }
    }

    processingUnit.member_id = user.member_id;
    processingUnit.id = p_Unit.id;

    return await this.pUnitRepo.save({
      ...p_Unit,
      ...processingUnit,
    });
  }

  async delete(user: User, pUnit_id: number) {
    const processingUnit = await this.pUnitRepo
      .createQueryBuilder('processingUnit')
      .where('processingUnit.id = :id', { id: pUnit_id })
      .andWhere('processingUnit.member_id = :memberId', {
        memberId: user.member_id,
      })
      .select(['processingUnit.file'])
      .getOneOrFail();

    if (processingUnit.file) {
      try {
        await this.S3.deleteFile(this.S3.getFileName(processingUnit.file));
      } catch (error) {
        throw new Error(error);
      }
    }

    return await this.pUnitRepo.delete({
      id: pUnit_id,
      member_id: user.member_id,
    });
  }

  async exportToExcel(
    user: User,
    lang: Language,
    ids: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    let items = await this.findAll(user);

    items = items.filter((item) => ids.includes(item.id));

    return await this.xlsxService.export(items, lang);
  }
}
