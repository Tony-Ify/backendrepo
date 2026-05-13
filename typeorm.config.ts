import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres' as const,
  host: configService.get<string>('DATABASE_HOST') || 'localhost',
  port: configService.get<number>('DATABASE_PORT') || 5432,
  username: configService.get<string>('DATABASE_USER') || 'postgres',
  password: configService.get<string>('DATABASE_PASSWORD') || '',
  database: configService.get<string>('DATABASE_NAME') || 'poll_voting_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
  logging: configService.get<string>('DATABASE_LOGGING') === 'true',
  subscribers: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);