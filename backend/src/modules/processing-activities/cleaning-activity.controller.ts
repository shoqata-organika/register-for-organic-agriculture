import {
  Body,
  Controller,
  Delete,
  Get,
  Res,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { CleaningActivityService } from './cleaning-activity.service';
import { Response } from 'express';
import { Language } from '../../localization';
import { CleaningActivityDto } from './cleaning-activity.dto';

@Controller('cleaning_activities')
export class CleaningActivityController {
  constructor(private readonly service: CleaningActivityService) {}

  @Get('/')
  async findAll(@Request() req): Promise<any> {
    return await this.service.findAll(req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') lang: Language,
    @Query('ids') ids: string,
  ) {
    const user = req.user;
    const buffer = await this.service.exportToExcel(
      user,
      lang,
      ids.split(',').map((id) => +id),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cleaning_activities.xlsx"',
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
    @Body() body: CleaningActivityDto,
  ): Promise<any> {
    return await this.service.create(body, req.user);
  }

  @Put('/:id')
  async update(
    @Request() req,
    @Body() body: CleaningActivityDto,
  ): Promise<any> {
    return await this.service.update(req.params.id, body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.service.delete(req.params.id, req.user);
  }
}
