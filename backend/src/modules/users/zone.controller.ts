import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  Res,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { Response } from 'express';
import { Language } from '../../localization';
import strToUndefined from '../../utils/strToUndefined';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Zone } from '../members/zone.entity';

@Controller('zones')
export class ZoneController {
  constructor(private readonly service: ZoneService) {}

  @Get('/')
  get(@Request() req: any): Promise<Zone[]> {
    return this.service.findAll(req.user);
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() zone: Zone,
    @Request() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    file?: Express.Multer.File,
  ) {
    zone = strToUndefined(zone);

    return this.service.create(zone, req.user, file);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Body() zone: Zone,
    @Request() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    file?: Express.Multer.File,
  ) {
    zone = strToUndefined(zone);

    return this.service.update(req.params.id, zone, req.user, file);
  }

  @Delete('/:id')
  delete(@Request() req: any) {
    return this.service.delete(req.params.id, req.user);
  }

  @Get('/export')
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
    res.setHeader('Content-Disposition', 'attachment; filename="zones.xlsx"');
    res.send(buffer);
  }
}
