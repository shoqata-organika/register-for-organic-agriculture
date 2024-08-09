import { DataSource } from 'typeorm';
import { Code } from './code.entity';
import { CodeCategory } from './code-category.entity';

export const codeCategoryProviders = [
  {
    provide: 'CODE_CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CodeCategory),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'CODE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Code),
    inject: ['DATA_SOURCE'],
  },
];
