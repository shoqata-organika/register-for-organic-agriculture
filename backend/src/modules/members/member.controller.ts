import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  Param,
  Query,
  Res,
  Request,
} from '@nestjs/common';
import { Member } from './member.entity';
import { Language } from '../../localization';
import { MemberCrop } from './member-crop.entity';
import { Response } from 'express';
import { MemberService } from './member.service';
import { IMember } from './member.interface';

@Controller('members')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Get()
  async getAll(@Request() req): Promise<Member[]> {
    return await this.service.findAll(req.user);
  }

  @Get('/crops')
  async getCrops(
    @Request() req,
    @Query('type') type: 'CROPS' | 'BMA_CROPS',
  ): Promise<MemberCrop[]> {
    return await this.service.findAllCrops(req.user, type);
  }

  @Get('/crop')
  async getCrop(
    @Request() req,
    @Query('cpId') cropId: number,
  ): Promise<MemberCrop> {
    return await this.service.findCrop(req.user, cropId);
  }

  @Post('/crops')
  async createCrop(
    @Request() req,
    @Body() data: MemberCrop,
  ): Promise<MemberCrop> {
    return await this.service.createCrop(req.user, data);
  }

  @Put('/crops')
  async updateCrop(
    @Request() req,
    @Body() data: MemberCrop,
  ): Promise<MemberCrop> {
    return await this.service.updateCrop(req.user, data);
  }

  @Delete('/crops/:id')
  async deleteCrop(@Request() req, @Param('id') id: number): Promise<void> {
    return await this.service.deleteCrop(req.user, id);
  }

  @Post()
  async create(@Body() member: IMember): Promise<Member> {
    return await this.service.create(member);
  }

  @Get('/lotCode')
  async getLotCode(
    @Request() req,
    @Query('cropId') cropId: number,
    @Query('partOfCropId') partOfCropId: number,
    @Query('date') date: Date,
    @Query('zoneId') zoneId?: number,
    @Query('landParcelId') landParcelId?: number,
  ): Promise<string> {
    return await this.service.generateLotCode(
      req.user,
      cropId,
      partOfCropId,
      date,
      landParcelId,
      zoneId,
    );
  }

  @Put('/:id')
  async update(@Request() req, @Body() member: IMember): Promise<any> {
    return await this.service.update(req.params.id, member);
  }

  @Delete('/:id')
  async delete(): Promise<void> {
    return await this.service.delete();
  }

  @Get('/export_crops')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') lang: Language,
    @Query('type') type: 'CROPS' | 'BMA_CROPS',
  ) {
    const user = req.user;
    const buffer = await this.service.exportCropsToExcel(user, lang, type);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="harvesters.xlsx"',
    );
    res.send(buffer);
  }
}
