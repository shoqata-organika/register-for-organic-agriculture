import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  Put,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { InventoryItemService } from './inventory-item.service';
import { Language } from '../../localization';
import { InventoryItemType } from './inventory-item.entity';
import { StoreAdmissionInventoryItemDto } from './dto';

@Controller('inventory_items')
export class InventoryItemController {
  constructor(private readonly service: InventoryItemService) {}

  @Get('/')
  async findAll(@Request() req, @Query('type') type: string): Promise<any> {
    return await this.service.findAll(req.user, type);
  }

  @Get('/dried_items')
  async findAllDriedItems(@Request() req): Promise<any> {
    const items = await this.service.findDriedItems(req.user);

    return items;
  }

  @Get('/sale')
  async findForSale(@Request() req): Promise<any> {
    return await this.service.findForSale(req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Query('type') type: InventoryItemType,
    @Query('language') language: Language,
    @Query('ids') ids: string,
    @Res() res: Response,
  ) {
    const user = req.user;
    const buffer = await this.service.exportToExcel(
      user,
      type,
      language,
      ids.split(',').map((id) => +id),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="inventory_items.xlsx"',
    );

    res.send(buffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @Request() req): Promise<any> {
    return await this.service.findOne(id, req.user);
  }

  @Post('/')
  async create(
    @Request() req,
    @Body() body: StoreAdmissionInventoryItemDto,
  ): Promise<any> {
    return await this.service.create(body, req.user);
  }

  @Put('/:id')
  async update(
    @Request() req,
    @Body() body: StoreAdmissionInventoryItemDto,
  ): Promise<any> {
    return await this.service.update(req.params.id, body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.service.delete(req.params.id, req.user);
  }
}
