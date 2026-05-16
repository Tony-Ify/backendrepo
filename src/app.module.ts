import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PollsModule } from './modules/polls/polls.module';
import { VotesModule } from './modules/votes/votes.module';

import { User } from './modules/users/entities/user.entity';
import { Poll } from './modules/polls/entities/poll.entity';
import { PollOption } from './modules/polls/entities/poll-option.entity';
import { Vote } from './modules/votes/entities/vote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Extract with explicit types
        const type = 'postgres' as const;
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const username = configService.get<string>('DATABASE_USER');
        const password = configService.get<string>('DATABASE_PASSWORD');
        const database = configService.get<string>('DATABASE_NAME');
        const synchronize =
          configService.get<string>('DATABASE_SYNCHRONIZE') === 'true';
        const logging =
          configService.get<string>('DATABASE_LOGGING') === 'true';

        // Validate required fields
        if (!host || !username || !database) {
          throw new Error(
            'Missing required database configuration. Check DATABASE_HOST, DATABASE_USER, DATABASE_NAME in .env',
          );
        }

        return {
          type,
          host: host || 'localhost',
          port: port || 5432,
          username,
          password: password || '',
          database,
          entities: [User, Poll, PollOption, Vote],
          synchronize,
          logging,
        };
      },
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET is not configured in .env file');
        }

        return {
          secret,
        };
      },
      global: true,
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    AuthModule,
    UsersModule,
    PollsModule,
    VotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
