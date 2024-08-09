import {
  Body,
  Controller,
  Post,
  Res,
  Request,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { Admission } from './admission.entity';
import { Language } from '../../localization';
import { AdmissionService } from './admission.service';
import { User } from '../users/user.entity';

@Controller('admissions')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get('/')
  async findAll(
    @Request() req,
    @Query('type') type: string,
  ): Promise<Admission[]> {
    return await this.admissionService.findAll(req.user, type);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req: any,
    @Query('type') type: string,
    @Query('language') language: Language,
    @Query('admids') admIds: string,
    @Res() res: Response,
  ) {
    const user = req.user;
    const buffer = await this.admissionService.exportToExcel(
      user,
      type,
      language,
      admIds.split(',').map((id) => +id),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="admissions.xlsx"',
    );

    res.send(buffer);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @Request() req): Promise<Admission> {
    return await this.admissionService.findOne(id, req.user);
  }

  @Post('/')
  async createCollection(
    @Body() request: Admission,
    @Request() req,
  ): Promise<Admission> {
    return await this.admissionService.create(request, req.user as User);
  }

  // @Put('/update/:type')
  // async updateHarvesting(
  //   @Param('type') type: 'collection' | 'harvesting',
  //   @Body() request: Admission,
  //   @Request() req,
  // ): Promise<void> {
  //   return await this.admissionService.updateActivity(
  //     request,
  //     type,
  //     req.user as User,
  //   );
  // }
}
