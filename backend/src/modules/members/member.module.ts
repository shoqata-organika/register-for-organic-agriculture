import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberCrop } from './member-crop.entity';
import { Member } from './member.entity';
import { DataSource } from 'typeorm';
import { MemberResource } from './member-resource.entity';
import { MemberResourceService } from './member-resource.service';
import { MemberCropXlsxService } from './member-crop-xlsx.service';
import { MemberResourceController } from './member-resource.controller';
import { User } from '../users/user.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Zone } from './zone.entity';
import { Code } from '../code-categories/code.entity';

@Module({
  imports: [DatabaseModule],
  exports: [MemberService],
  providers: [
    MemberService,
    MemberResourceService,
    MemberCropXlsxService,
    {
      provide: 'CODE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Code);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'MEMBER_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Member);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(User);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'MEMBER_CROP_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(MemberCrop);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'MEMBER_RESOURCE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(MemberResource);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ZONE_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Zone);
      },
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LAND_PARCEL_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(LandParcel);
      },
      inject: ['DATA_SOURCE'],
    },
  ],
  controllers: [MemberController, MemberResourceController],
})
export class MemberModule {}
