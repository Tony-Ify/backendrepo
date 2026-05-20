import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitSeeder } from './seeds/init.seeder';
import { SeedCommand } from './seeds/seed.command';
import { Poll } from '@/modules/polls/entities/poll.entity';
import { User } from '@/modules/users/entities/user.entity';
import { PollOption } from '@/modules/polls/entities/poll-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Poll, PollOption]),
  ],
  providers: [InitSeeder, SeedCommand],
  exports: [InitSeeder],
})
export class DatabaseModule {}