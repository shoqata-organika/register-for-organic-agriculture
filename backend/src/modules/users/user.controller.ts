import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Zone } from '../members/zone.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Harvester } from '../members/harvester.entity';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get('/')
  getUsers(@Request() req) {
    return this.service.findAllForMember(req.user.member_id);
  }

  @Post('/')
  createUser(@Body() user: User, @Request() req) {
    return this.service.create(user, req.user.member_id);
  }

  @Put('/:id')
  updateUser(@Body() user: User, @Request() req, @Param('id') id: number) {
    user.id = id;

    return this.service.update(user, req.user.member_id);
  }

  @Delete('/:id')
  deleteUser(@Request() req) {
    return this.service.delete(req.params.id, req.user.member_id);
  }

  @Get('/me')
  getMe(@Request() req) {
    return this.service.getUser(req.user.id);
  }

  @Get('/zones')
  getZones(@Request() req): Promise<Zone[]> {
    return this.service.getZones(req.user.id);
  }

  @Get('/land_parcels')
  getLandParcels(@Request() req): Promise<LandParcel[]> {
    return this.service.getLandParcels(req.user.id);
  }

  @Get('/harvesters')
  getHarvesters(@Request() req): Promise<Harvester[]> {
    return this.service.getHarvesters(req.user.id);
  }

  @Get('/resources')
  getResources(@Request() req, @Query() query: { resource_type }) {
    return this.service.getResources(req.user.id, query.resource_type);
  }
}
