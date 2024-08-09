import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Request,
  Delete,
  Query,
  Put,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { OptionalParseFilePipe } from '../../pipes/filePipe';
import { JSONParsePipe } from '../../pipes/parseJSON';
import { Language } from '../../localization';
import { FarmActivityService } from './farm-activities.service';
import { FarmActivityDto } from './dto';
import strToUndefined from '../../utils/strToUndefined';
import { User } from '../users/user.entity';

@Controller('farm_activities')
export class FarmActivityController {
  constructor(private readonly farmActivityService: FarmActivityService) {}

  @Get('/')
  async findAll(@Request() req: any): Promise<FarmActivityDto[]> {
    return await this.farmActivityService.findAll(req.user as User);
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async createActivity(
    @Request() req: any,
    @Body(JSONParsePipe) body: FarmActivityDto,
    @UploadedFile(OptionalParseFilePipe) file: Express.Multer.File,
  ): Promise<void> {
    body = strToUndefined(body);

    await this.farmActivityService.create(body, req.user as User, file);
  }

  @Delete('/delete/:id')
  async deleteActivity(@Request() req: any): Promise<void> {
    this.farmActivityService.delete(req.params.id, req.user);
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateActivity(
    @Param('id') activityId: number,
    @Body(JSONParsePipe) newActivity: FarmActivityDto,
    @Request() req: any,
    @UploadedFile(OptionalParseFilePipe) file: Express.Multer.File,
  ): Promise<Partial<FarmActivityDto>> {
    newActivity = strToUndefined(newActivity);

    return this.farmActivityService.update(
      activityId,
      newActivity,
      req.user as User,
      file,
    );
  }

  @Get('export')
  async downloadExcel(
    @Request() req: any,
    @Res() res: Response,
    @Query('language') language: Language,
    @Query('ids') ids: string,
  ) {
    const user = req.user;
    const buffer = await this.farmActivityService.exportToExcel(
      user,
      language,
      ids.split(',').map((item) => +item),
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="farm_activities.xlsx"',
    );

    res.send(buffer);
  }
}
