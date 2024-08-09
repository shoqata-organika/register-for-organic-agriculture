import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminController } from './admin.controller';
import { DatabaseModule } from '../database/database.module';
import { MemberModule } from '../members/member.module';
import { Member } from '../members/member.entity';
import { AdminService } from './admin.service';

@Module({
  imports: [MemberModule, DatabaseModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'MEMBER_REPOSITORY',
      useFactory: (dataSource: DataSource) => {
        return dataSource.getRepository(Member);
      },
      inject: ['DATA_SOURCE'],
    },
  ],
})
export class AdminModule {}
