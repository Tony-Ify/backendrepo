import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './entities/vote.entity';
import { PollsModule } from '../polls/polls.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule, UsersModule],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}