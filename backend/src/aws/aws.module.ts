import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AWS3 } from './aws.service';

@Module({
  imports: [ConfigModule],
  providers: [AWS3],
  exports: [AWS3],
})
export class AWSModule {}
