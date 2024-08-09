import {
  Controller,
  Get,
  Request,
  Delete,
  Res,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { ProcessingActivityService } from './processing-activities.service';
import { Language } from '../../localization';
import { Response } from 'express';
import {
  ProcessingActivityDto,
  StoreProcessingActivityDto,
  NewProcessingActivityEntryDto,
} from './dto';
import {
  ProcessingActivity,
  ProcessingType,
} from '../activities/processing-activity.entity';

@Controller('processing_activities')
export class ProcessingActivityController {
  constructor(
    private readonly processingActivityService: ProcessingActivityService,
  ) {}

  @Get('/')
  async findAll(
    @Request() req: any,
    @Query('type') type: ProcessingType,
  ): Promise<ProcessingActivityDto[]> {
    return await this.processingActivityService.findAll(req.user, type);
  }

  @Delete('/delete/:id')
  async deleteActivity(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.processingActivityService.delete(id, req.user);
  }

  @Post('/')
  async createActivity(
    @Request() req: any,
    @Body() body: NewProcessingActivityEntryDto,
    @Query('type') type: ProcessingType,
  ): Promise<any> {
    return await this.processingActivityService.create(body, req.user, type);
  }

  @Put('/:id')
  async updateActivity(
    @Param('id') id: number,
    @Request() req: any,
    @Body() body: StoreProcessingActivityDto,
  ): Promise<ProcessingActivity> {
    return await this.processingActivityService.update(id, body, req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('type') type: ProcessingType,
    @Query('language') lang: Language,
    @Query('ids') ids: string,
  ) {
    const user = req.user;
    const buffer = await this.processingActivityService.exportToExcel(
      user,
      lang,
      ids.split(',').map((item) => +item),
      type,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="processing_activities.xlsx"',
    );

    res.send(buffer);
  }
}
