import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VotesService } from './votes.service';
import { VotesController, ResultsController } from './votes.controller';
import { Vote } from './entities/vote.entity';
import { PollsModule } from '../polls/polls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule],
  controllers: [VotesController, ResultsController],
  providers: [VotesService],
  exports: [VotesService],
})
export class VotesModule {}