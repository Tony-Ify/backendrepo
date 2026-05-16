import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Poll } from '../../polls/entities/poll.entity';
import { PollOption } from '../../polls/entities/poll-option.entity';

@Entity('votes')
@Unique('UQ_one_vote_per_user_per_poll', ['userId', 'pollId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  userId!: number;

  @Column({ type: 'integer' })
  pollId!: number;

  @Column({ type: 'integer' })
  optionId!: number;

  @Column({ type: 'varchar', length: 100 })
  state!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Poll, (poll) => poll.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'optionId' })
  option!: PollOption;
}
