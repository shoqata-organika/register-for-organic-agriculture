import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Req,
  Body,
  UploadedFile,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Language } from '../../localization';
import { ProcessingUnit } from './processing-unit.entity';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import { ProcessingUnitService } from './processing-unit.service';
import { toDate } from '../../utils/toDate';
import strToUndefined from '../../utils/strToUndefined';

@Controller('processing_unit')
export class ProcessingUnitController {
  constructor(private readonly service: ProcessingUnitService) {}

  @Get()
  async findAll(@Req() req: any): Promise<ProcessingUnit[]> {
    return this.service.findAll(req.user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createP_Unit(
    @Req() req: any,
    @Body() processingUnit: ProcessingUnit,
    @UploadedFile(new OptionalParseFilePipe())
    file: Express.Multer.File | undefined,
  ) {
    processingUnit = strToUndefined(processingUnit);
    toDate(processingUnit, ['contract_start_date', 'contract_end_date']);

    return this.service.create(processingUnit, req.user, file);
  }

  @Delete('/:id')
  async deleteP_Unit(@Req() req: any) {
    return this.service.delete(req.user, req.params.id);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateP_unit(
    @Body() processingUnit: ProcessingUnit,
    @Req() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    file: Express.Multer.File | undefined,
  ) {
    processingUnit = strToUndefined(processingUnit);
    toDate(processingUnit, ['contract_start_date', 'contract_end_date']);

    return this.service.update(req.params.id, processingUnit, req.user, file);
  }

  @Get('/export')
  async downloadExcel(
    @Req() req: any,
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
      'attachment; filename="processing_units.xlsx"',
    );

    res.send(buffer);
  }
}
