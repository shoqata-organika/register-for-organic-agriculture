import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Member } from './member.entity';
import { IMember } from './member.interface';
import { MemberCrop } from './member-crop.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Language } from '../../localization';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { getWeek } from 'date-fns';
import { MemberCropXlsxService } from './member-crop-xlsx.service';
import { Zone } from './zone.entity';
import { Code } from '../code-categories/code.entity';

@Injectable()
export class MemberService {
  constructor(
    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,

    @Inject('USER_REPOSITORY')
    private readonly userRepo: Repository<User>,

    @Inject('MEMBER_CROP_REPOSITORY')
    private readonly memberCropRepo: Repository<MemberCrop>,

    @Inject('LAND_PARCEL_REPOSITORY')
    private readonly landParcelRepo: Repository<LandParcel>,

    @Inject('ZONE_REPOSITORY')
    private readonly zoneRepo: Repository<Zone>,

    @Inject('CODE_REPOSITORY')
    private readonly codeRepo: Repository<Code>,

    private readonly memberCropXlsxService: MemberCropXlsxService,
  ) {}

  async findAll(user: User): Promise<Member[]> {
    const allMembers = await this.memberRepo.find({
      where: { id: user.member_id },
    });

    return allMembers.map((member) => ({
      ...member,
      activities: member.activities ? JSON.parse(member.activities) : null,
    }));
  }

  async create(data: IMember): Promise<Member> {
    if (data.activities) {
      data.activities = JSON.stringify(data.activities);
    }

    const member = await this.memberRepo.save(data);

    const user = this.userRepo.create({
      username: data.username,
      password: data.password,
      member,
    });

    await this.userRepo.save(user);

    return member;
  }

  async update(id: number, member: IMember): Promise<Member> {
    const oldMember = await this.memberRepo.findOneOrFail({
      where: { id },
    });

    if (!oldMember) {
      throw new NotFoundException('Member not found');
    }

    if (member.activities) {
      member.activities = JSON.stringify(member.activities);
    }

    const memberCredentials = {
      first_name: undefined,
      last_name: undefined,
    };

    // since empty strings are also valid and will be stored into db
    // we convert them to undefined/null so that we don't alocate unnecessary space
    if (
      typeof member.owner_first_name === 'string' &&
      !member.owner_first_name
    ) {
      memberCredentials.first_name = undefined;
    } else {
      memberCredentials.first_name = member.owner_first_name;
    }

    // since empty strings are also valid and will be stored into db
    // we convert them to undefined/null so that we don't alocate unnecessary space
    if (typeof member.owner_last_name === 'string' && !member.owner_last_name) {
      memberCredentials.last_name = undefined;
    } else {
      memberCredentials.last_name = member.owner_last_name;
    }

    member.owner = JSON.stringify(memberCredentials);

    return await this.memberRepo.save({
      ...oldMember,
      ...member,
    });
  }

  async exists(
    code: string,
    member_id: number,
    member_crop_id?: number,
  ): Promise<boolean> {
    console.log('checking for', code, member_id, member_crop_id);

    let memberCrop = this.memberCropRepo
      .createQueryBuilder('member_crop')
      .where('member_crop.code = :code', { code: code })
      .andWhere('member_crop.member_id = :member_id', {
        member_id: member_id,
      });

    if (member_crop_id) {
      memberCrop = memberCrop.andWhere('member_crop.id <> :member_crop_id', {
        member_crop_id,
      });
    }

    return (await memberCrop.getMany()).length > 0;
  }

  async findAllCrops(
    user: User,
    type: 'CROPS' | 'BMA_CROPS',
  ): Promise<MemberCrop[]> {
    const crops = await this.memberCropRepo
      .createQueryBuilder('member_crop')
      .leftJoinAndSelect('member_crop.crop', 'crop')
      .leftJoinAndSelect('crop.subCodes', 'subCodes')
      .leftJoinAndSelect('crop.codeCategory', 'codeCategory')
      .leftJoinAndSelect('member_crop.member', 'member')
      .where({ member_id: user.member_id })
      .andWhere({
        crop: {
          codeCategory: {
            api_name: type,
          },
        },
      })
      .getMany();

    return crops;
  }

  async findCrop(user: User, cropId: number): Promise<MemberCrop> {
    const crops = await this.memberCropRepo
      .createQueryBuilder('member_crop')
      .leftJoinAndSelect('member_crop.crop', 'crop')
      .leftJoinAndSelect('crop.subCodes', 'subCodes')
      .leftJoinAndSelect('crop.codeCategory', 'codeCategory')
      .leftJoinAndSelect('member_crop.member', 'member')
      .where({
        member_id: user.member_id,
        crop_id: cropId,
      })
      .getOne();

    return crops;
  }

  async createCrop(user: User, crop: MemberCrop): Promise<MemberCrop> {
    if (await this.exists(crop.code, user.member_id, crop.id)) {
      throw new BadRequestException('Code already exists');
    }

    crop.crop_id = +crop.crop_id;
    crop.member_id = user.member_id;

    return await this.memberCropRepo.save(crop);
  }

  async updateCrop(user: User, crop: MemberCrop): Promise<MemberCrop> {
    const existingCrop = await this.memberCropRepo
      .createQueryBuilder('member_crop')
      .where('member_crop.id = :id', { id: crop.id })
      .andWhere({ member_id: user.member_id })
      .getOneOrFail();

    return await this.memberCropRepo.save({
      ...existingCrop,
      ...crop,
    });
  }

  async deleteCrop(user: User, id: number): Promise<void> {
    try {
      await this.memberCropRepo.delete({
        id,
        member_id: user.member_id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(): Promise<void> {}

  async generateLotCode(
    user: User,
    cropId: number,
    partOfCropId: number,
    date: Date,
    landParcelId?: number,
    zoneId?: number,
  ): Promise<string> {
    const member = await this.memberRepo.findOneOrFail({
      where: { id: user.member_id },
    });

    const crop = await this.memberCropRepo.findOneOrFail({
      where: { crop_id: cropId, member_id: user.member_id },
    });

    const partOfCrop = await this.codeRepo.findOneOrFail({
      where: { id: partOfCropId },
    });

    const weekAndYear = this.getWeekAndYear(date);

    if (zoneId) {
      const zone = await this.zoneRepo.findOneOrFail({
        where: { id: zoneId, member_id: user.member_id },
      });
      return [member.code, crop.code, partOfCrop.id, zone.code, weekAndYear]
        .filter((k) => k !== null)
        .join('-');
    } else if (landParcelId) {
      const landParcel = await this.landParcelRepo.findOneOrFail({
        where: { id: landParcelId, member_id: user.member_id },
      });

      return [
        member.code,
        crop.code,
        partOfCrop.id,
        landParcel.code,
        weekAndYear,
      ]
        .filter((k) => k !== null)
        .join('-');
    }
    return '';
  }

  private getWeekAndYear(date: Date) {
    // format date using date-fns, format: WEEK / YEAR (e.g. 52/20)

    const week = getWeek(date);
    const year = date.getFullYear();

    return `${week}/${year}`;
  }

  async exportCropsToExcel(
    user: User,
    lang: Language,
    type: 'CROPS' | 'BMA_CROPS',
  ) {
    const crops = await this.findAllCrops(user, type);

    return await this.memberCropXlsxService.export(crops, lang);
  }
}
