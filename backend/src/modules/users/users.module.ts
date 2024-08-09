import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { HarvesterController } from './harvester.controller';
import { HarvesterService } from './harvester.service';
import { LandParcelService } from './land-parcel.service';
import { LandParcelController } from './land-parcel.controller';
import { ZoneController } from './zone.controller';
import { AWSModule } from '../../aws/aws.module';
import { HarvesterXlsxService } from './harvester-xlsx.service';
import { ZoneXlsxService } from './zone-xlsx.service';
import { ZoneService } from './zone.service';
import { LandParcelXlsxService } from './land-parcel-xlsx.service';

@Module({
  imports: [DatabaseModule, AWSModule],
  providers: [
    ...userProviders,
    UsersService,
    HarvesterService,
    LandParcelXlsxService,
    LandParcelService,
    HarvesterXlsxService,
    ZoneService,
    ZoneXlsxService,
  ],
  exports: [UsersService],
  controllers: [
    UserController,
    HarvesterController,
    LandParcelController,
    ZoneController,
  ],
})
export class UsersModule {}
