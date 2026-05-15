import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption]), UsersModule],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService],
})
export class PollsModule {}