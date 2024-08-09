import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { MemberResourceService } from './member-resource.service';

@Controller('resources')
export class MemberResourceController {
  constructor(private readonly service: MemberResourceService) {}

  @Get('/')
  async findAll(
    @Request() req,
    @Query('resource_types') resource_types: string,
  ): Promise<any> {
    const resourceTypes = resource_types ? resource_types.split(',') : [];

    return await this.service.findAll(req.user, resourceTypes);
  }

  @Get('/:id')
  async findOne(@Request() req): Promise<any> {
    return await this.service.findOne(req.params.id, req.user);
  }

  @Post('/')
  async create(@Request() req): Promise<any> {
    return await this.service.create(req.body, req.user);
  }

  @Put('/:id')
  async update(@Request() req): Promise<any> {
    return await this.service.update(req.params.id, req.body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.service.delete(req.params.id, req.user);
  }
}
