import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Language } from '../../localization';
import { InventoryLocationService } from './inventory-location.service';

@Controller('inventory_locations')
export class InventoryLocationController {
  constructor(private readonly service: InventoryLocationService) {}

  @Get('/')
  async findAll(@Request() req): Promise<any> {
    return await this.service.findAll(req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') language: Language,
  ) {
    const user = req.user;
    const buffer = await this.service.exportToExcel(user, language);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="inventory_locations.xlsx"',
    );

    res.send(buffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @Request() req): Promise<any> {
    return await this.service.findOne(id, req.user);
  }

  @Post('/')
  async create(@Request() req): Promise<any> {
    return await this.service.create(req.body, req.user);
  }

  @Put('/:id')
  async update(@Request() req): Promise<any> {
    return await this.service.update(req.params.id, req.body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.service.delete(req.params.id, req.user);
  }
}
