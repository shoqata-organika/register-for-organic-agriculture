import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Code } from './code.entity';

@Entity({ name: 'code_categories' })
export class CodeCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  api_name: string;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500, nullable: true })
  name_sq: string;

  @Column({ length: 500, nullable: true })
  name_sr: string;

  @OneToMany(() => Code, (code) => code.codeCategory, { cascade: true })
  codes: Code[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
