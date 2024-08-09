import { DeepPartial, In, MoreThan, Repository, Not, Brackets } from 'typeorm';
import { Member } from '../members/member.entity';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { InventoryLocation } from './inventory-location.entity';
import { Language } from '../../localization';
import * as ExcelJS from 'exceljs';
import { InventoryItem, InventoryItemType } from './inventory-item.entity';
import { InventoryItemXlsxService } from './inventory-item-xlsx.service';
import { StoreAdmissionInventoryItemDto, StoreInventoryItemDto } from './dto';
import {
  MemberResource,
  ResourceType,
} from '../members/member-resource.entity';
import { ProcessingActivity } from '../activities/processing-activity.entity';
import { Admission, AdmissionType } from '../admissions/admission.entity';
import { AdmissionEntry } from '../admissions/admission-entry.entity';
import { Sale } from '../accounting/sale.entity';
import { ProcessingType } from '../activities/processing-activity.entity';
import { InventoryOperation } from './inventory-operation.entity';
import { ProcessingActivityEntry } from '../activities/processing-activity-entry.entity';
import {
  FarmActivity,
  FertilizationDetails,
  SeedPlantingDetails,
} from '../activities/farm-activity.entity';

@Injectable()
export class InventoryItemService {
  constructor(
    @Inject('INVENTORY_ITEM_REPOSITORY')
    private readonly repo: Repository<InventoryItem>,

    @Inject('INVENTORY_LOCATION_REPOSITORY')
    private readonly locationRepo: Repository<InventoryLocation>,

    @Inject('MEMBER_REPOSITORY')
    private readonly memberRepo: Repository<Member>,

    @Inject('MEMBER_RESOURCE_REPOSITORY')
    private readonly resourceRepo: Repository<MemberResource>,

    @Inject('ADMISSION_ENTRY_REPOSITORY')
    private readonly caRepo: Repository<AdmissionEntry>,

    @Inject('PROCESSING_ACTIVITY_REPOSITORY')
    private readonly paRepo: Repository<ProcessingActivity>,

    private readonly xlsxService: InventoryItemXlsxService,
  ) {}

  async findForSale(currentUser: User): Promise<InventoryItem[]> {
    const query = this.repo
      .createQueryBuilder('inventory_item')
      .innerJoinAndSelect('inventory_item.member', 'member')
      .leftJoinAndSelect(
        'inventory_item.inventoryLocation',
        'inventoryLocation',
      )
      .leftJoinAndSelect('inventory_item.admissionEntry', 'admissionEntry')
      .leftJoinAndSelect('admissionEntry.admission', 'admission')
      .leftJoinAndSelect('inventory_item.crop', 'crop')
      .leftJoinAndSelect('inventory_item.partOfCrop', 'partOfCrop')
      .leftJoinAndSelect('inventory_item.producer', 'producer')
      .where('inventory_item.member_id = :memberId', {
        memberId: currentUser.member_id,
      })
      .andWhere({ quantity: MoreThan(0) });

    const items = await query.orderBy('inventory_item.date', 'DESC').getMany();

    return items;
  }

  async findDriedItems(currentUser: User): Promise<InventoryItem[]> {
    const items = await this.repo
      .createQueryBuilder('inventory_item')
      .innerJoinAndSelect('inventory_item.member', 'member')
      .innerJoinAndSelect('inventory_item.admissionEntry', 'admissionEntry')
      .innerJoinAndSelect('admissionEntry.admission', 'admission')
      .leftJoinAndSelect(
        'inventory_item.inventoryLocation',
        'inventoryLocation',
      )
      .leftJoinAndSelect('admission.harvester', 'harvester')
      .leftJoinAndSelect('admission.contractedFarmer', 'contractedFarmer')
      .leftJoinAndSelect('admission.zone', 'zone')
      .leftJoinAndSelect('admission.landParcel', 'landParcel')
      .leftJoinAndSelect('inventory_item.crop', 'crop')
      .leftJoinAndSelect('inventory_item.partOfCrop', 'partOfCrop')
      .where('inventory_item.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where({
            type: Not(InventoryItemType.PROCESSED_PRODUCT),
          }).orWhere({
            type: In([
              InventoryItemType.COLLECTED_PRODUCT,
              InventoryItemType.HARVESTED_PRODUCT,
              InventoryItemType.PURCHASED_PRODUCT,
              InventoryItemType.DRIED_PRODUCT,
            ]),
          });
        }),
      )
      .andWhere({ quantity: MoreThan(0) })
      .orderBy('inventory_item.date', 'DESC')
      .getMany();

    return items.filter((item) => {
      if (
        item.type === InventoryItemType.COLLECTED_PRODUCT ||
        item.type === InventoryItemType.HARVESTED_PRODUCT ||
        item.type === InventoryItemType.PURCHASED_PRODUCT
      ) {
        return item.admissionEntry.cropState === 'dry';
      }

      return item;
    });
  }

  async findAll(currentUser: User, type: string): Promise<InventoryItem[]> {
    let query = this.repo
      .createQueryBuilder('inventory_item')
      .innerJoinAndSelect('inventory_item.member', 'member')
      .leftJoinAndSelect(
        'inventory_item.inventoryLocation',
        'inventoryLocation',
      )
      .where('inventory_item.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .andWhere({ quantity: MoreThan(0) });

    if (type === InventoryItemType.HARVESTED_PRODUCT) {
      query = query.andWhere({
        type: In([
          InventoryItemType.HARVESTED_PRODUCT,
          InventoryItemType.PURCHASED_PRODUCT,
        ]),
      });
    } else {
      query = query.andWhere({ type });
    }

    if (
      type === InventoryItemType.HARVESTED_PRODUCT ||
      type === InventoryItemType.COLLECTED_PRODUCT ||
      type === InventoryItemType.PURCHASED_PRODUCT ||
      type === InventoryItemType.PROCESSED_PRODUCT ||
      type === InventoryItemType.DRIED_PRODUCT
    ) {
      query = query
        .leftJoinAndSelect('inventory_item.admissionEntry', 'admissionEntry')
        .leftJoinAndSelect('admissionEntry.admission', 'admission')
        .leftJoinAndSelect('admission.harvester', 'harvester')
        .leftJoinAndSelect('admission.contractedFarmer', 'contractedFarmer')
        .leftJoinAndSelect('admission.zone', 'zone')
        .leftJoinAndSelect('admission.landParcel', 'landParcel')
        .leftJoinAndSelect('inventory_item.crop', 'crop')
        .leftJoinAndSelect('inventory_item.partOfCrop', 'partOfCrop');

      query = query.orderBy('admission.admission_no', 'DESC');
    }

    if (
      type === InventoryItemType.INPUT ||
      type === InventoryItemType.PLANTING_MATERIAL
    ) {
      query = query.leftJoinAndSelect('inventory_item.supplier', 'supplier');
      query = query.leftJoinAndSelect('inventory_item.producer', 'producer');
      query = query.orderBy('inventory_item.date', 'DESC');
    }

    const items = await query.getMany();

    return items;
  }

  async findOne(id: number, currentUser: User): Promise<InventoryItem> {
    const location = this.repo
      .createQueryBuilder('inventory_item')
      .innerJoinAndSelect('inventory_item.member', 'member')
      .leftJoinAndSelect(
        'inventory_item.inventoryLocation',
        'inventoryLocation',
      )
      .leftJoinAndSelect('inventory_item.person', 'person')
      .leftJoinAndSelect('inventory_item.admissionEntry', 'admissionEntry')
      .leftJoinAndSelect('admissionEntry.admission', 'admission')
      .leftJoinAndSelect('admission.harvester', 'harvester')
      .leftJoinAndSelect('admission.contractedFarmer', 'contractedFarmer')
      .leftJoinAndSelect('admission.zone', 'zone')
      .leftJoinAndSelect('admission.landParcel', 'landParcel')
      .leftJoinAndSelect('inventory_item.supplier', 'supplier')
      .leftJoinAndSelect('inventory_item.producer', 'producer')
      .leftJoinAndSelect('inventory_item.crop', 'crop')
      .leftJoinAndSelect('inventory_item.partOfCrop', 'partOfCrop')
      .where('inventory_item.member_id = :member_id', {
        member_id: currentUser.member_id,
      })
      .andWhere({ id })
      .getOne();

    return location;
  }

  async create(
    item: StoreInventoryItemDto,
    currentUser: User,
  ): Promise<InventoryItem> {
    const newItem = this.repo.create({
      date: item.date.toISOString(),
      quantity: item.quantity,
      notes: item.notes,
      packageType: item.package_type,
      sku: item.sku,
      cost: item.cost,
      purchaseDate: item.purchaseDate?.toISOString(),
      expiryDate: item.expiryDate?.toISOString(),
      name: item.name,
      description: item.description,
      type: item.type,
      operations: [],
    });

    const member = await this.memberRepo.findOne({
      where: { id: currentUser.member_id },
    });
    newItem.member = member;

    if (item.inventory_location_id) {
      const location = await this.locationRepo.findOne({
        where: {
          id: item.inventory_location_id,
          member_id: currentUser.member_id,
        },
      });

      if (!location) return null;
      newItem.inventory_location_id = location.id;
    }

    if (item.person) {
      await this.upsertResource(
        item.person,
        ResourceType.PERSON,
        currentUser.member_id,
      );
      newItem.person_id = item.person.id;
    }

    if (item.supplier) {
      await this.upsertResource(
        item.supplier,
        ResourceType.SUPPLIER,
        currentUser.member_id,
      );
      newItem.supplier_id = item.supplier.id;
    }

    if (item.producer) {
      await this.upsertResource(
        item.producer,
        ResourceType.PRODUCER,
        currentUser.member_id,
      );
      newItem.producer_id = item.producer.id;
    }

    await this.assignAdmissionInventoryItemAttributes(
      item,
      newItem,
      currentUser,
    );

    newItem.operations.push({
      quantity: item.quantity,
    } as InventoryOperation);

    await this.repo.save(newItem);

    return newItem;
  }

  async update(
    id: number,
    item: StoreInventoryItemDto,
    currentUser: User,
  ): Promise<InventoryItem> {
    const existingItem = await this.repo.findOneOrFail({
      where: {
        id,
        member_id: currentUser.member_id,
      },
    });

    if (item.inventory_location_id) {
      await this.locationRepo.findOneOrFail({
        where: {
          id: item.inventory_location_id,
          member_id: currentUser.member_id,
        },
      });
    }

    const itemToUpdate: DeepPartial<InventoryItem> = {
      ...existingItem,
      date: item.date.toISOString(),
      notes: item.notes,
      packageType: item.package_type,
      inventory_location_id: item.inventory_location_id,
      type: item.type,
      sku: item.sku,
      cost: item.cost,
      purchaseDate: item.purchaseDate?.toISOString(),
      expiryDate: item.expiryDate?.toISOString(),
      name: item.name,
      description: item.description,
    };

    if (item.person) {
      await this.upsertResource(
        item.person,
        ResourceType.PERSON,
        currentUser.member_id,
      );
      itemToUpdate.person_id = item.person.id;
    }

    if (item.supplier) {
      await this.upsertResource(
        item.supplier,
        ResourceType.SUPPLIER,
        currentUser.member_id,
      );
      itemToUpdate.supplier_id = item.supplier.id;
    }

    if (item.producer) {
      await this.upsertResource(
        item.producer,
        ResourceType.PRODUCER,
        currentUser.member_id,
      );
      itemToUpdate.producer_id = item.producer.id;
    }

    await this.assignAdmissionInventoryItemAttributes(
      item,
      itemToUpdate,
      currentUser,
    );

    await this.repo.update(id, itemToUpdate);
    const updatedItem = await this.repo.findOne({ where: { id } });

    return updatedItem;
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

  async handleFertilization(
    farmActivity: FarmActivity,
    details: FertilizationDetails,
    currentUser: User,
  ) {
    const fertilizerItem = await this.repo.findOne({
      where: {
        member_id: currentUser.member_id,
        producer_id: details.producer.id,
        type: InventoryItemType.INPUT,
        name: details.product.name,
      },
      relations: ['operations'],
    });

    if (fertilizerItem) {
      fertilizerItem.quantity =
        +fertilizerItem.quantity - +farmActivity.quantity;

      fertilizerItem.operations.push({
        quantity: -farmActivity.quantity,
        date: farmActivity.date,
        notes: 'Used for fertilization',
      } as InventoryOperation);

      await this.repo.save(fertilizerItem);
    } else {
      const initialQuantity =
        +farmActivity.quantity + +details.remaining_quantity;

      const inventoryItem = this.repo.create({
        date: farmActivity.date,
        type: InventoryItemType.INPUT,
        name: details.product.name,
        producer_id: details.producer.id,
        supplier_id: details.supplier.id,
        member_id: currentUser.member_id,
        quantity: +details.remaining_quantity,
        operations: [
          {
            quantity: initialQuantity,
            date: farmActivity.date,
            notes: 'Initial quantity',
            farm_activity_id: farmActivity.id,
          },
          {
            quantity: -farmActivity.quantity,
            date: farmActivity.date,
            notes: 'Used for fertilization',
            farm_activity_id: farmActivity.id,
          },
        ],
      });

      await this.repo.save(inventoryItem);
    }
  }

  async handleSeedPlanting(
    farmActivity: FarmActivity,
    details: SeedPlantingDetails,
    currentUser: User,
  ) {
    const plantingItem = await this.repo.findOne({
      where: {
        member_id: currentUser.member_id,
        name: details.material_type,
        type: InventoryItemType.PLANTING_MATERIAL,
      },
      relations: ['operations'],
    });

    if (plantingItem) {
      plantingItem.quantity = +plantingItem.quantity - +farmActivity.quantity;

      plantingItem.operations.push({
        quantity: -farmActivity.quantity,
        date: farmActivity.date,
        notes: 'Used for planting',
      } as InventoryOperation);

      await this.repo.save(plantingItem);
    } else {
      const initialQuantity =
        +farmActivity.quantity + +details.remaining_quantity;

      const inventoryItem = this.repo.create({
        date: farmActivity.date,
        type: InventoryItemType.PLANTING_MATERIAL,
        name: details.material_type,
        member_id: currentUser.member_id,
        quantity: +details.remaining_quantity,
        operations: [
          {
            quantity: initialQuantity,
            date: farmActivity.date,
            notes: 'Initial quantity',
            farm_activity_id: farmActivity.id,
          },
          {
            quantity: -farmActivity.quantity,
            date: farmActivity.date,
            notes: 'Used for planting',
            farm_activity_id: farmActivity.id,
          },
        ],
      });

      await this.repo.save(inventoryItem);
    }
  }

  async handleAdmissionItems(admission: Admission, currentUser: User) {
    console.log('handling items', admission);
    const entries = admission.entries;

    await Promise.all(
      entries.map((entry) => this.handleAdmissionEntries(entry, currentUser)),
    );
  }

  async handleProcessedItems(
    processingActivity: ProcessingActivity,
    currentUser: User,
  ) {
    const invItemType =
      processingActivity?.processingType &&
      processingActivity.processingType === ProcessingType.DRYING
        ? InventoryItemType.DRIED_PRODUCT
        : InventoryItemType.PROCESSED_PRODUCT;

    await Promise.all(
      processingActivity.entries.map(async (entry) => {
        const input: Partial<StoreAdmissionInventoryItemDto> = {
          id: processingActivity.id,
          admission_entry_id: entry.inventoryItem.admission_entry_id,
          date: new Date(processingActivity.date),
          type: invItemType,
          crop_id: entry.crop_id,
          part_of_crop_id: entry.part_of_crop_id,
          quantity: entry.netQuantity,
          sku: processingActivity.lotCode,
        };

        await this.updateAdmissionInventoryItem(entry);

        const existingProcessingItem = processingActivity.id
          ? await this.repo.findOne({
              where: {
                processing_activity_id: processingActivity.id,
                admission_entry_id: input.admission_entry_id,
                type: invItemType,
              },
            })
          : null;

        if (existingProcessingItem) {
          return this.update(
            existingProcessingItem.id,
            input as StoreInventoryItemDto,
            currentUser,
          );
        } else {
          return this.create(input as StoreInventoryItemDto, currentUser);
        }
      }),
    );
  }

  async handleSale(sale: Sale, user: User, previousSale?: Sale) {
    if (sale.inventory_item_id) {
      const item = await this.repo.findOneOrFail({
        where: {
          id: sale.inventory_item_id,
          member_id: user.member_id,
        },
        relations: ['operations'],
      });

      if (previousSale) {
        if (previousSale.inventory_item_id === sale.inventory_item_id) {
          item.operations.push({
            quantity: previousSale.quantity,
            notes: 'Previous sale',
          } as InventoryOperation);
        } else {
          const previousItem = await this.repo.findOneOrFail({
            where: {
              id: previousSale.inventory_item_id,
              member_id: user.member_id,
            },
            relations: ['operations'],
          });

          previousItem.operations.push({
            quantity: previousSale.quantity,
          } as InventoryOperation);

          await this.repo.save(previousItem);
        }
      }

      item.operations.push({
        quantity: -sale.quantity,
        notes: 'Sale',
      } as InventoryOperation);

      console.log('sale', item.operations);

      item.quantity = item.operations.reduce(
        (acc, operation) => acc + operation.quantity,
        0,
      );

      await this.repo.save(item);
    }
  }

  private getInventoryItemType(admission: Admission) {
    if (admission.type === AdmissionType.COLLECTION) {
      return InventoryItemType.COLLECTED_PRODUCT;
    } else if (admission.type === AdmissionType.HARVESTING) {
      return InventoryItemType.HARVESTED_PRODUCT;
    } else if (admission.type === AdmissionType.PURCHASE) {
      return InventoryItemType.PURCHASED_PRODUCT;
    }
  }

  private async updateAdmissionInventoryItem(entry: ProcessingActivityEntry) {
    const existingItem = entry.inventoryItem;

    if (existingItem) {
      const quantityToUse = entry.grossQuantity;

      existingItem.quantity = existingItem.quantity - quantityToUse;

      existingItem.operations.push({
        inventory_item_id: existingItem.id,
        quantity: -quantityToUse,
        notes: 'Used for processing',
      } as InventoryOperation);

      await this.repo.save(existingItem);
    }
  }

  private async handleAdmissionEntries(
    admissionEntry: AdmissionEntry,
    currentUser: User,
  ) {
    const input: Partial<StoreAdmissionInventoryItemDto> = {
      admission_entry_id: admissionEntry.id,
      date: new Date(admissionEntry.admission.date),
      type: this.getInventoryItemType(admissionEntry.admission),
      crop_id: admissionEntry.crop_id,
      part_of_crop_id: admissionEntry.part_of_crop_id,
      quantity: admissionEntry.net_quantity,
    };

    const item = await this.findExistingInventoryItem(admissionEntry);

    if (item) {
      return this.update(item.id, input as StoreInventoryItemDto, currentUser);
    } else {
      return this.create(input as StoreInventoryItemDto, currentUser);
    }
  }

  private async findExistingInventoryItem(admissionEntry: AdmissionEntry) {
    const item = await this.repo.findOne({
      where: {
        admission_entry_id: admissionEntry.id,
        crop_id: admissionEntry.crop_id,
        part_of_crop_id: admissionEntry.part_of_crop_id,
      },
      relations: ['operations'],
    });

    return item;
  }

  private async findProcessingActivity(id: number, member_id: number) {
    return await this.paRepo
      .createQueryBuilder('processing_activity')
      .where({ id })
      .andWhere('member_id = :member_id', {
        member_id,
      })
      .getOneOrFail();
  }

  private async assignAdmissionInventoryItemAttributes(
    input: StoreInventoryItemDto,
    item: DeepPartial<InventoryItem>,
    currentUser: User,
  ) {
    if (
      item.type === InventoryItemType.HARVESTED_PRODUCT ||
      item.type === InventoryItemType.COLLECTED_PRODUCT ||
      item.type === InventoryItemType.PROCESSED_PRODUCT ||
      item.type === InventoryItemType.PURCHASED_PRODUCT ||
      item.type === InventoryItemType.DRIED_PRODUCT
    ) {
      const castItem = input as StoreAdmissionInventoryItemDto;
      item.admission_entry_id = castItem.admission_entry_id;
      item.crop_id = castItem.crop_id;
      item.part_of_crop_id = castItem.part_of_crop_id;

      if (
        item.type === InventoryItemType.PROCESSED_PRODUCT ||
        item.type === InventoryItemType.DRIED_PRODUCT
      ) {
        const processingActivity = await this.findProcessingActivity(
          castItem.id,
          currentUser.member_id,
        );

        item.processing_activity_id = processingActivity.id;
      }
    }
  }

  async exportToExcel(
    user: User,
    type: string,
    language: Language,
    ids: Array<number>,
  ): Promise<ExcelJS.Buffer> {
    let items = await this.findAll(user, type);

    items = items.filter((item) => ids.includes(item.id));

    return await this.xlsxService.export(items, type, language);
  }
}
