import {
  Controller,
  Param,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Language } from '../../localization';
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get('/')
  async findAll(@Request() req): Promise<any> {
    return await this.saleService.findAll(req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') language: Language,
    @Query('ids') ids: string,
  ) {
    const user = req.user;
    const buffer = await this.saleService.exportToExcel(
      user,
      language,
      ids.split(',').map((id) => +id),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="sales.xlsx"');
    res.send(buffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @Request() req): Promise<any> {
    return await this.saleService.findOne(id, req.user);
  }

  @Post('/')
  async create(@Request() req): Promise<any> {
    return await this.saleService.create(req.body, req.user);
  }

  @Put('/:id')
  async update(@Request() req): Promise<any> {
    return await this.saleService.update(req.params.id, req.body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.saleService.delete(req.params.id, req.user);
  }
}
