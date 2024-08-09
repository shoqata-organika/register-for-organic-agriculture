import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { AWS3 } from '../../aws/aws.service';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { LandParcelXlsxService } from './land-parcel-xlsx.service';
import { LandParcelCrop } from '../land-parcels/land-parcel-crop.entity';
import { SubParcel } from '../land-parcels/subparcel.entity';

export class LandParcelService {
  constructor(
    @Inject('LAND_PARCEL_REPOSITORY')
    private readonly landParcelRepo: Repository<LandParcel>,

    @Inject('LAND_PARCEL_CROP_REPOSITORY')
    private readonly parcelCropRepo: Repository<LandParcelCrop>,

    @Inject('SUB_PARCEL_REPOSITORY')
    private readonly subParcelRepo: Repository<SubParcel>,

    private readonly S3: AWS3,
    private readonly xlsxService: LandParcelXlsxService,
  ) {}

  async exists(
    code: string,
    member_id: number,
    land_parcel_id?: number,
  ): Promise<boolean> {
    let harvesters = this.landParcelRepo
      .createQueryBuilder('land_parcel')
      .where('land_parcel.code = :code', { code: code })
      .andWhere('land_parcel.member_id = :member_id', { member_id: member_id })
      .andWhere('land_parcel.contracted_farmer_id IS NULL');

    if (land_parcel_id) {
      harvesters = harvesters.andWhere('land_parcel.id <> :land_parcel_id', {
        land_parcel_id: land_parcel_id,
      });
    }

    return (await harvesters.getMany()).length > 0;
  }

  async findAll(user: User): Promise<LandParcel[]> {
    const allParcels = await this.landParcelRepo
      .createQueryBuilder('landParcel')
      .leftJoinAndSelect('landParcel.crops', 'parcelCrops')
      .leftJoinAndSelect('parcelCrops.crop', 'crop')
      .leftJoinAndSelect('landParcel.subParcels', 'subParcels')
      .where('landParcel.member_id = :id', { id: user.member_id })
      .andWhere('landParcel.contracted_farmer_id IS NULL')
      .getMany();

    return allParcels.map((parcel) => ({
      ...parcel,
      subParcels: parcel.subParcels.sort((a, b) => +a.code - +b.code),
    }));
  }

  async create(
    landParcel: LandParcel,
    user: User,
    file?: Express.Multer.File,
  ): Promise<LandParcel> {
    if (await this.exists(landParcel.code, user.member_id)) {
      throw new BadRequestException('Code already exists');
    }

    if (file) {
      try {
        const response = await this.S3.uploadFile(file);

        landParcel.file = response ? response : null;
      } catch (error) {
        throw new Error(error);
      }
    }

    landParcel.member_id = user.member_id;

    const lp = await this.landParcelRepo.save({
      ...landParcel,
      crops: [],
      subParcels: [],
    });

    landParcel.subParcels.forEach((sp) => (sp.land_parcel_id = lp.id));
    landParcel.crops.forEach((pc) => {
      pc.land_parcel_id = lp.id;
    });
    this.upsertSubParcels(landParcel.subParcels);

    await Promise.all(
      landParcel.crops.map((pc) => this.parcelCropRepo.save(pc)),
    );

    return lp;
  }

  async update(
    id: number,
    landParcel: LandParcel,
    user: User,
    file?: Express.Multer.File,
  ): Promise<LandParcel> {
    if (await this.exists(landParcel.code, user.member_id, id)) {
      throw new BadRequestException('Code already exists');
    }

    const existingLandParcel = await this.landParcelRepo
      .createQueryBuilder('landParcel')
      .where('landParcel.id = :id', { id })
      .andWhere('landParcel.member_id = :member_id', {
        member_id: user.member_id,
      })
      .leftJoinAndSelect('landParcel.crops', 'parcelCrops')
      .leftJoinAndSelect('landParcel.subParcels', 'subParcels')
      .getOneOrFail();

    if (file) {
      try {
        const response = await this.S3.uploadFile(
          file,
          this.S3.getFileName(existingLandParcel.file),
        );

        if (response) landParcel.file = response;
      } catch (error) {
        throw new Error(error);
      }
    }

    landParcel.member_id = user.member_id;
    landParcel.id = existingLandParcel.id;

    if (landParcel.crops.length > 0) {
      landParcel.crops.forEach((cp) => {
        delete cp.crop;
      });
    }

    // parcel crops to remove
    existingLandParcel.crops
      .filter((pc) => !landParcel.crops.some((lpc) => lpc.id === pc.id))
      .forEach(async (pc) => {
        await this.parcelCropRepo.delete(pc.id);
      });

    // sub parcels to remove
    existingLandParcel.subParcels
      .filter((sp) => !landParcel.subParcels.some((lsp) => lsp.id === sp.id))
      .forEach(async (sp) => {
        await this.subParcelRepo.delete(sp.id);
      });

    await this.upsertSubParcels(
      landParcel.subParcels.map((sp) => ({ ...sp, land_parcel_id: id })),
    );

    return await this.landParcelRepo.save({
      ...existingLandParcel,
      ...landParcel,
    });
  }

  async delete(id: number, user: User): Promise<void> {
    await this.landParcelRepo.delete({
      id,
      member_id: user.member_id,
    });
  }

  async getCrops(id: number, date: Date, user: User): Promise<any[]> {
    const data = await this.landParcelRepo
      .createQueryBuilder('landParcel')
      .innerJoinAndSelect('landParcel.crops', 'parcelCrops')
      .innerJoinAndSelect('parcelCrops.crop', 'crop')
      .leftJoinAndSelect('crop.subCodes', 'subCodes')
      .where('landParcel.member_id = :id', { id: user.member_id })
      .andWhere('landParcel.id = :landParcelId', { landParcelId: id })
      .getMany();

    return data.map((lp) => lp.crops.map((pc) => pc.crop)).flat();
  }

  async exportToExcel(user: User, lang: Language): Promise<ExcelJS.Buffer> {
    const parcels = await this.findAll(user);

    return this.xlsxService.export(parcels, lang);
  }

  private async upsertSubParcels(subParcels: SubParcel[]) {
    await Promise.all(
      subParcels.map(async (subParcel) => {
        await this.subParcelRepo.upsert(subParcel, ['id']);
      }),
    );
  }
}
