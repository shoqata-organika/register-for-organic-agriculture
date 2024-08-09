import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ContractedFarmer } from './contracted-farmer.entity';
import { Language } from '../../localization';
import { User } from '../users/user.entity';
import * as ExcelJS from 'exceljs';
import { AWS3 } from '../../aws/aws.service';
import { ContractedFarmerXlsxService } from './contracted-farmer-xlsx.service';
import { Repository } from 'typeorm';
import { ContractedFarmerDTO } from './contracted-farmer.dto';
import { LandParcel } from '../land-parcels/land-parcel.entity';

@Injectable()
export class ContractedFarmerService {
  constructor(
    @Inject('CONTRACTED_FARMERS_REPOSITORY')
    private readonly contractedFarmerRepo: Repository<ContractedFarmer>,
    @Inject('LAND_PARCEL_REPOSITORY')
    private readonly landParcelRepo: Repository<LandParcel>,
    private readonly S3: AWS3,
    private readonly xlsxService: ContractedFarmerXlsxService,
  ) {}

  async exists(
    code: string,
    member_id: number,
    contractedFarmer_id?: number,
  ): Promise<boolean> {
    console.log('checking for', code, member_id, contractedFarmer_id);

    let contractedFarmer = this.contractedFarmerRepo
      .createQueryBuilder('contracted_farmer')
      .where('contracted_farmer.code = :code', { code: code })
      .andWhere('contracted_farmer.member_id = :member_id', {
        member_id: member_id,
      });

    if (contractedFarmer_id) {
      contractedFarmer = contractedFarmer.andWhere(
        'contracted_farmer.id <> :contractedFarmer_id',
        {
          contractedFarmer_id: contractedFarmer_id,
        },
      );
    }

    return (await contractedFarmer.getMany()).length > 0;
  }

  async findAll(user: User): Promise<ContractedFarmer[]> {
    const query = await this.contractedFarmerRepo
      .createQueryBuilder('contracted_farmer')
      .leftJoinAndSelect('contracted_farmer.landParcels', 'landParcels')
      .where('contracted_farmer.member_id = :memberId', {
        memberId: user.member_id,
      })
      .orderBy('contracted_farmer.code', 'ASC')
      .getMany();

    return query;
  }

  async getLandParcels(id: number, user: User): Promise<LandParcel[]> {
    return await this.contractedFarmerRepo
      .findOneOrFail({
        where: { id: id, member_id: user.member_id },
        relations: ['landParcels'],
      })
      .then((cf) => cf.landParcels);
  }

  async create(
    contractedFarmer: ContractedFarmerDTO,
    user: User,
    file: Express.Multer.File | undefined,
  ): Promise<ContractedFarmer> {
    if (await this.exists(contractedFarmer.code, user.member_id)) {
      throw new BadRequestException('Code already exists');
    }

    const existingContractedFarmer = await this.contractedFarmerRepo
      .createQueryBuilder('contracted_farmer')
      .where('contracted_farmer.id = :id', { id: contractedFarmer.id })
      .andWhere('contracted_farmer.member_id = :memberId', {
        memberId: user.member_id,
      })
      .getOne();

    if (existingContractedFarmer) {
      throw new BadRequestException('Contracted Farmer already exists');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(file);

        if (response) {
          contractedFarmer.image = response;
        }
      } catch (error) {
        console.error(error);

        throw new Error(error);
      }
    }

    let landParcels = [];

    if (contractedFarmer.landParcels) {
      landParcels = JSON.parse(contractedFarmer.landParcels);

      landParcels.forEach((parcel) => {
        parcel.member_id = user.member_id;
      });

      landParcels = landParcels.filter((lp) => !lp._delete);
    }

    return await this.contractedFarmerRepo.save({
      ...contractedFarmer,
      member_id: user.member_id,
      landParcels: landParcels,
    });
  }

  async update(
    cf_id: number,
    contractedFarmer: ContractedFarmerDTO,
    user: User,
    file: Express.Multer.File | undefined,
  ): Promise<ContractedFarmer> {
    if (await this.exists(contractedFarmer.code, user.member_id, cf_id)) {
      throw new BadRequestException('Code already exists');
    }

    const existingContractedFarmer = await this.contractedFarmerRepo.findOne({
      where: { id: cf_id, member_id: user.member_id },
    });

    if (!existingContractedFarmer) {
      throw new NotFoundException('Contracted Farmer not found');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(
          file,
          this.S3.getFileName(existingContractedFarmer.image),
        );

        if (response) {
          contractedFarmer.image = response;
        }
      } catch (error) {
        throw new Error(error);
      }
    }

    contractedFarmer.id = +contractedFarmer.id;

    let landParcels = [];

    if (contractedFarmer.landParcels) {
      landParcels = JSON.parse(contractedFarmer.landParcels);

      landParcels.forEach((parcel) => {
        if (parcel._delete) {
          this.landParcelRepo.delete({ id: parcel.id });
        } else {
          parcel.member_id = user.member_id;
        }
      });
    }

    return await this.contractedFarmerRepo.save({
      ...existingContractedFarmer,
      name: contractedFarmer.name,
      personal_num: contractedFarmer.personal_num,
      address: contractedFarmer.address,
      external_id: contractedFarmer.external_id,
      code: contractedFarmer.code,
      landParcels: landParcels,
    });
  }

  async delete(user: User, cf_id: number): Promise<void> {
    const contractedFarmer = await this.contractedFarmerRepo
      .createQueryBuilder('contractedFarmer')
      .where('contractedFarmer.id = :id', { id: cf_id })
      .andWhere('contractedFarmer.member_id = :memberId', {
        memberId: user.member_id,
      })
      .getOneOrFail();

    try {
      if (contractedFarmer.image) {
        await this.S3.deleteFile(
          this.S3.getFileName(contractedFarmer.image),
        ).catch((err) => console.error(err));
      }
    } catch (error) {
      throw new Error(error);
    }

    await this.contractedFarmerRepo.softDelete({
      id: +cf_id,
      member_id: user.member_id,
    });
  }

  async exportToExcel(user: User, language: Language): Promise<ExcelJS.Buffer> {
    const harvesters = await this.findAll(user);

    return this.xlsxService.export(harvesters, language);
  }
}
