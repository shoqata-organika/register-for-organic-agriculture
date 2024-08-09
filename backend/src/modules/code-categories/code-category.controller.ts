import { Body, Controller, Get, Param, Post, Query, Put } from '@nestjs/common';
import { CodeCategoryService } from './code-category.service';
import { CodeCategory } from './code-category.entity';
import { CodeCategoryDto } from './dto';

@Controller('code_categories')
export class CodeCategoryController {
  constructor(private readonly service: CodeCategoryService) {}

  @Get('/')
  getCategories(): Promise<CodeCategory[]> {
    return this.service.findAll();
  }

  @Get('/by_api_names')
  async getCategoryByApiName(@Query('names') names: string) {
    const apiNames = names.split(',').map((name) => name.trim());

    const categories = await this.service.findByApiNames(apiNames);

    return categories.map((category) => ({
      ...category,
      codes: category.codes
        .map((code) => ({
          ...code,
          subCodes: code.subCodes,
          codeCategory: undefined,
          created_at: undefined,
        }))
        .sort((a, b) => (a.name as any) - (b.name as any)),
    }));
  }

  @Get('/:api_name')
  async getValuesByApiName(@Param('api_name') name: string) {
    const category = await this.service.findByApiName(name);

    return category;
  }

  @Post()
  create(@Body() request: CodeCategoryDto) {
    return this.service.create(request);
  }

  @Post('/code')
  createCode(@Body() request: any) {
    return this.service.createCode(request);
  }

  @Put('/code')
  updateCode(@Body() request: any) {
    return this.service.updateCode(request);
  }
}
