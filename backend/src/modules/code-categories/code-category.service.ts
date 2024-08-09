import { Injectable, Inject } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CodeCategory } from './code-category.entity';
import { Code } from './code.entity';
import { CodeCategoryDto } from './dto';

@Injectable()
export class CodeCategoryService {
  constructor(
    @Inject('CODE_CATEGORY_REPOSITORY')
    private codeCategoryRepository: Repository<CodeCategory>,

    @Inject('CODE_REPOSITORY')
    private codeRepository: Repository<Code>,
  ) {}

  async findAll(): Promise<CodeCategory[]> {
    return this.codeCategoryRepository.find();
  }

  async create(codeCategory: CodeCategoryDto): Promise<CodeCategory> {
    const newCategory = this.codeCategoryRepository.create(codeCategory);
    console.log(newCategory);
    return this.codeCategoryRepository.save(newCategory);
  }

  async createCode(data: any): Promise<any> {
    const category = await this.findByApiName(data.codeCategoryType);

    const newCode = this.codeRepository.create({
      name: data.name,
      name_sq: data.name_sq,
      name_sr: data.name_sr,
      code: data.code,
      codeCategory: category,
    });

    return await this.codeRepository.save(newCode);
  }

  async updateCode(data: any): Promise<any> {
    const code = await this.codeRepository.findOneOrFail({
      where: {
        id: data.id,
      },
    });

    return await this.codeRepository.save({
      ...code,
      ...data,
    });
  }

  async findOne(id: number): Promise<CodeCategory> {
    return this.codeCategoryRepository.findOne({
      where: { id: id },
    });
  }

  async findByApiNames(api_names: string[]): Promise<CodeCategory[]> {
    return this.codeCategoryRepository
      .createQueryBuilder('codeCategory')
      .innerJoinAndSelect('codeCategory.codes', 'codes')
      .leftJoinAndSelect('codes.subCodes', 'subCodes') // Adding the join for subCodes
      .where({ api_name: In(api_names) })
      .getMany();
  }

  async findByApiName(api_name: string): Promise<CodeCategory> {
    return this.codeCategoryRepository
      .createQueryBuilder('codeCategory')
      .innerJoinAndSelect('codeCategory.codes', 'codes')
      .leftJoinAndSelect('codes.subCodes', 'subCodes') // Adding the join for subCodes
      .where({ api_name: api_name })
      .getOne();
  }
}
