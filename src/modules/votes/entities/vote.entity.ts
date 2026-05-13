import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  ForeignKey,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Poll } from 'src/modules/polls/entities/poll.entity';
import { PollOption } from 'src/modules/polls/entities/poll-option.entity';

@Entity('votes')
@Unique('UQ_one_vote_per_user_per_poll', ['userId', 'pollId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  @ForeignKey(() => User)
  userId!: number;

  @Column({ type: 'integer' })
  @ForeignKey(() => Poll)
  pollId!: number;

  @Column({ type: 'integer' })
  @ForeignKey(() => PollOption)
  optionId!: number;

  @Column({ type: 'varchar', length: 100 })
  state!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => User, user => user.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Poll, poll => poll.votes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @ManyToOne(() => PollOption, option => option.votes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'optionId' })
  option!: PollOption;
}