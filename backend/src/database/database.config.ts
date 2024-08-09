import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  url: process.env.DATABASE_URL || undefined,
  username: process.env.USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || undefined,
  database: process.env.DATABASE || 'organika-orms',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  ssl:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
      ? { rejectUnauthorized: false }
      : false,
  synchronize: false,
  logging: true,
  migrations: ['dist/database/migrations/**/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export default dataSource;
