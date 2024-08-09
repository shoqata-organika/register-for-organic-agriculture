import { Controller, Delete, Get, Post, Put, Request } from '@nestjs/common';
import { ExpenseService } from './expense.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('/')
  async findAll(@Request() req): Promise<any> {
    return await this.expenseService.findAll(req.user);
  }

  @Get('/:id')
  async findOne(@Request() req): Promise<any> {
    return await this.expenseService.findOne(req.params.id, req.user);
  }

  @Post('/')
  async create(@Request() req): Promise<any> {
    return await this.expenseService.create(req.body, req.user);
  }

  @Put('/:id')
  async update(@Request() req): Promise<any> {
    return await this.expenseService.update(req.params.id, req.body, req.user);
  }

  @Delete('/:id')
  async delete(@Request() req): Promise<any> {
    return await this.expenseService.delete(req.params.id, req.user);
  }
}
