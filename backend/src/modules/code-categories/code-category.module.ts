import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CodeCategoryService } from './code-category.service';
import { codeCategoryProviders } from './code-category.providers';
import { CodeCategoryController } from './code-category.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...codeCategoryProviders, CodeCategoryService],
  controllers: [CodeCategoryController],
  exports: [CodeCategoryService],
})
export class CodeCategoryModule {}
