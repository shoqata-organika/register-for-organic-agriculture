import { DeepPartial, Repository } from 'typeorm';
import { Expense, ExpenseType } from './expense.entity';
import { User } from '../users/user.entity';
import { Member } from '../members/member.entity';
import { Inject } from '@nestjs/common';
import {
  MemberResource,
  ResourceType,
} from '../members/member-resource.entity';
import { ActivityType, FarmActivity } from '../activities/farm-activity.entity';

export class ExpenseService {
  constructor(
    @Inject('EXPENSE_REPOSITORY')
    private readonly expenseRepo: Repository<Expense>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,

    @Inject('MEMBER_RESOURCE_REPOSITORY')
    private readonly resourceRepo: Repository<MemberResource>,
  ) {}

  async findAll(currentUser: User): Promise<Expense[]> {
    const expenses = await this.expenseRepo
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.member', 'member')
      .leftJoinAndSelect('expense.supplier', 'supplier')
      .where('expense.member_id = :member_id')
      .orderBy('expense.date', 'DESC')
      .setParameter('member_id', currentUser.member_id)
      .getMany();

    return expenses;
  }

  async findOne(id: number, currentUser: User): Promise<Expense> {
    const expense = this.expenseRepo
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.member', 'member')
      .where('expense.id = :id', { id })
      .andWhere('expense.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return expense;
  }

  async create(
    expense: DeepPartial<Expense>,
    currentUser: User,
  ): Promise<Expense> {
    const member = await this.memberRepo.findOne({
      where: { id: currentUser.member_id },
    });
    expense.member = member;

    if (expense.supplier) {
      await this.upsertResource(
        { id: expense.supplier.id, name: expense.supplier.name },
        ResourceType.SUPPLIER,
        currentUser.member_id,
      );
    }

    const newExpense = await this.expenseRepo.create(expense);
    await this.expenseRepo.save(newExpense);

    return newExpense;
  }

  async update(
    id: number,
    expense: DeepPartial<Expense>,
    currentUser: User,
  ): Promise<Expense> {
    const oldExpense = await this.expenseRepo.findOneOrFail({
      where: { id, member_id: currentUser.member_id },
    });

    if (expense.supplier) {
      await this.upsertResource(
        { id: expense.supplier.id, name: expense.supplier.name },
        ResourceType.SUPPLIER,
        currentUser.member_id,
      );
    }

    const updatedExpense = await this.expenseRepo.merge(oldExpense, expense);
    await this.expenseRepo.save(updatedExpense);

    return updatedExpense;
  }

  async delete(id: number, currentUser: User): Promise<void> {
    await this.expenseRepo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });
    await this.expenseRepo.delete({ id, member_id: currentUser.member_id });
  }

  async handleFarmActivity(activity: FarmActivity) {
    if (activity.cost) {
      // find existing
      const existingExpense = await this.expenseRepo.findOne({
        where: { farm_activity_id: activity.id },
      });

      if (existingExpense) {
        existingExpense.price = activity.cost;
        existingExpense.date = activity.date;

        await this.expenseRepo.save(existingExpense);
      } else {
        await this.expenseRepo.save({
          date: activity.date,
          member_id: activity.member_id,
          quantity: 1,
          price: activity.cost,
          farm_activity_id: activity.id,
          type: this.getExpenseType(activity.activity_type),
        });
      }
    }
  }

  async upsertResource(
    resource: { id: string; name: string },
    resourceType: ResourceType,
    member_id: number,
  ) {
    await this.resourceRepo.upsert(
      {
        id: resource.id,
        name: resource.name,
        member_id: member_id,
        resource_type: resourceType,
      },
      ['id'],
    );
  }

  private getExpenseType(activityType: string): ExpenseType {
    switch (activityType) {
      case ActivityType.LAND_PLOUGHING:
        return ExpenseType.LAND_PLOUGHING;
      case ActivityType.MILLING:
        return ExpenseType.MILLING;
      case ActivityType.BED_PREPARATION:
        return ExpenseType.BED_PREPARATION;
      default:
        return ExpenseType.OTHER;
    }
  }
}
