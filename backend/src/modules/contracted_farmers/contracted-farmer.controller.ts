import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ContractedFarmer } from './contracted-farmer.entity';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Language } from '../../localization';
import { ContractedFarmerService } from './contracted-farmer.service';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import strToUndefined from '../../utils/strToUndefined';
import { ContractedFarmerDTO } from './contracted-farmer.dto';

@Controller('contracted_farmer')
export class ContractedFarmerController {
  constructor(private readonly service: ContractedFarmerService) {}

  @Get('/')
  async getAll(@Req() req: any): Promise<ContractedFarmer[]> {
    return await this.service.findAll(req.user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Req() req: any,
    @Body() contractedFarmer: ContractedFarmerDTO,
    @UploadedFile(new OptionalParseFilePipe())
    image: Express.Multer.File | undefined,
  ) {
    contractedFarmer = strToUndefined(contractedFarmer);

    return this.service.create(contractedFarmer, req.user, image);
  }

  @Delete('/:id')
  async delete(@Req() req: any) {
    return this.service.delete(req.user, req.params.id);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Body() contractedFarmer: ContractedFarmerDTO,
    @Req() req: any,
    @UploadedFile(new OptionalParseFilePipe())
    image: Express.Multer.File | undefined,
  ) {
    contractedFarmer = strToUndefined(contractedFarmer);

    return this.service.update(
      req.params.id,
      contractedFarmer,
      req.user,
      image,
    );
  }

  @Get('/export')
  async downloadExcel(
    @Req() req: any,
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
      'attachment; filename="contracted_farmers.xlsx"',
    );
    res.send(buffer);
  }

  @Get('/:id/land_parcels')
  async getLandParcels(@Req() req: any) {
    return this.service.getLandParcels(req.params.id, req.user);
  }
}
