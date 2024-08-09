import { IsNotEmpty } from 'class-validator';

export class CodeCategoryDto {
  @IsNotEmpty()
  name: string;

  description: string;
}
