import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CodeCategory } from './code-category.entity';

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ length: 500, nullable: true })
  name_sq: string;

  @Column({ length: 500, nullable: true })
  name_sr: string;

  @ManyToOne(() => CodeCategory, (codeCategory) => codeCategory.codes)
  codeCategory: CodeCategory;

  @ManyToMany(() => Code, { cascade: true })
  @JoinTable()
  subCodes: Code[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
