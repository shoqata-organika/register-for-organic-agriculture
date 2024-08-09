import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import strToUndefined from '../../utils/strToUndefined';
import { Language } from '../../localization';
import { toDate } from '../../utils/toDate';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { LandParcelService } from './land-parcel.service';
import { LandParcel } from '../land-parcels/land-parcel.entity';

@Controller('land_parcels')
export class LandParcelController {
  constructor(private readonly service: LandParcelService) {}

  @Get('/')
  async getLandParcels(@Request() req): Promise<LandParcel[]> {
    return await this.service.findAll(req.user);
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() landParcel: LandParcel,
    @Request() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    file?: Express.Multer.File,
  ) {
    landParcel = strToUndefined(landParcel);

    if (typeof landParcel.subParcels === 'string') {
      landParcel.subParcels = JSON.parse(landParcel.subParcels);
    }

    if (typeof landParcel.crops === 'string') {
      landParcel.crops = JSON.parse(landParcel.crops);
    }

    // TODO: convert to dates threw pipeline
    toDate(landParcel, [
      'organic_transition_date',
      'contract_start_date',
      'contract_end_date',
    ]);

    return await this.service.create(landParcel, req.user, file);
  }

  @Get('export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') lang: Language,
  ) {
    const user = req.user;
    const buffer = await this.service.exportToExcel(user, lang);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="land_parcels.xlsx"',
    );
    res.send(buffer);
  }

  @Get('/:id/crops')
  async getCrops(@Request() req: any, @Query('date') date: Date) {
    return await this.service.getCrops(req.params.id, date, req.user);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Body() landParcel: LandParcel,
    @Request() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    file?: Express.Multer.File,
  ) {
    landParcel = strToUndefined(landParcel);

    if (typeof landParcel.subParcels === 'string') {
      landParcel.subParcels = JSON.parse(landParcel.subParcels);
    }

    if (typeof landParcel.crops === 'string') {
      landParcel.crops = JSON.parse(landParcel.crops);
    }

    // TODO: convert to dates threw pipeline
    toDate(landParcel, [
      'organic_transition_date',
      'contract_start_date',
      'contract_end_date',
    ]);

    return await this.service.update(req.params.id, landParcel, req.user, file);
  }

  @Delete('/:id')
  delete(@Request() req: any) {
    return this.service.delete(req.params.id, req.user);
  }
}
