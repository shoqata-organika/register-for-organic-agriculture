import { DeepPartial, Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { Member } from '../members/member.entity';
import { Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { InventoryItemService } from '../inventory/inventory-item.service';
import { SaleXlsxService } from './sale-xlsx.service';
import { ResourceType } from '../members/member-resource.entity';

export class SaleService {
  constructor(
    @Inject('SALE_REPOSITORY')
    private readonly repo: Repository<Sale>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,

    @Inject(InventoryItemService)
    private readonly inventoryItemService: InventoryItemService,

    private readonly xlsxService: SaleXlsxService,
  ) {}

  async findAll(currentUser: User): Promise<Sale[]> {
    const sales = await this.repo
      .createQueryBuilder('sale')
      .innerJoinAndSelect('sale.member', 'member')
      .innerJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.inventoryItem', 'inventoryItem')
      .leftJoinAndSelect('inventoryItem.crop', 'crop')
      .leftJoinAndSelect('inventoryItem.partOfCrop', 'partOfCrop')
      .where('sale.member_id = :member_id')
      .orderBy('sale.date', 'DESC')
      .setParameter('member_id', currentUser.member_id)
      .getMany();

    return sales;
  }

  async findOne(id: number, currentUser: User): Promise<Sale> {
    const sale = this.repo
      .createQueryBuilder('sale')
      .innerJoinAndSelect('sale.member', 'member')
      .where('sale.id = :id', { id })
      .andWhere('sale.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .getOne();

    return sale;
  }

  async create(sale: DeepPartial<Sale>, currentUser: User): Promise<Sale> {
    sale.member_id = currentUser.member_id;

    if (sale.customer) {
      await this.inventoryItemService.upsertResource(
        { id: sale.customer.id, name: sale.customer.name },
        ResourceType.CUSTOMER,
        currentUser.member_id,
      );

      sale.customer_id = sale.customer.id;
    }
    const newSale = await this.repo.create(sale);

    await this.inventoryItemService.handleSale(newSale, currentUser);

    await this.repo.save(newSale);

    return newSale;
  }

  async update(
    id: number,
    sale: DeepPartial<Sale>,
    currentUser: User,
  ): Promise<Sale> {
    const existingSale = await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    if (sale.customer) {
      await this.inventoryItemService.upsertResource(
        { id: sale.customer.id, name: sale.customer.name },
        ResourceType.CUSTOMER,
        currentUser.member_id,
      );

      sale.customer_id = sale.customer.id;
    }

    await this.repo.update(id, sale);
    const updatedSale = await this.repo.findOne({ where: { id } });

    await this.inventoryItemService.handleSale(
      updatedSale,
      currentUser,
      existingSale,
    );

    return updatedSale;
  }

  async delete(id: number, currentUser: User): Promise<void> {
    await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    await this.repo.delete({ id, member_id: currentUser.member_id });
  }

  async exportToExcel(
    user: User,
    language: Language,
    ids: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    let sales = await this.findAll(user);

    sales = sales.filter((sale) => ids.includes(sale.id));

    return this.xlsxService.export(sales, language);
  }
}
