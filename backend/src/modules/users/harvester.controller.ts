import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Harvester } from '../members/harvester.entity';
import { Language } from '../../localization';
import { Response } from 'express';
import { HarvesterService } from './harvester.service';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import strToUndefined from '../../utils/strToUndefined';

@Controller('harvesters')
export class HarvesterController {
  constructor(private readonly service: HarvesterService) {}

  @Get('/')
  async getHarvesters(@Request() req: any): Promise<Harvester[]> {
    return await this.service.findAll(req.user);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createHarvester(
    @UploadedFiles(new OptionalParseFilePipe())
    files: Array<Express.Multer.File> | undefined,
    @Body() harvester: Harvester,
    @Request() req: any,
  ) {
    harvester = strToUndefined(harvester);

    return await this.service.create(harvester, req.user, files);
  }

  @Put('/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async updateHarvester(
    @UploadedFiles(new OptionalParseFilePipe())
    files: Array<Express.Multer.File> | undefined,
    @Body() harvester: Harvester,
    @Request() req: any,
  ) {
    harvester = strToUndefined(harvester);

    return await this.service.update(req.params.id, harvester, req.user, files);
  }

  @Delete('/:id')
  async deleteHarvester(@Request() req: any) {
    return await this.service.delete(req.params.id, req.user);
  }

  @Get('/export')
  async downloadExcel(
    @Request() req,
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
      'attachment; filename="harvesters.xlsx"',
    );
    res.send(buffer);
  }
}
