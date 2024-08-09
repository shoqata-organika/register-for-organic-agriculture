import { DataSource } from 'typeorm';
import { Expense } from './expense.entity';
import { Sale } from './sale.entity';
import { Member } from '../members/member.entity';
import { MemberResource } from '../members/member-resource.entity';

export const accountingProviders = [
  {
    provide: 'EXPENSE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Expense),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'SALE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Sale),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MEMBER_RESOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MemberResource),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MEMBER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Member),
    inject: ['DATA_SOURCE'],
  },
];
