import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PollOption } from './poll-option.entity';
import { Vote } from '../../votes/entities/vote.entity';

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: PollStatus,
    default: PollStatus.ACTIVE,
  })
  status!: PollStatus;

  @Column({ type: 'int' })
  createdById!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt!: Date | null;

  // Relations
  @ManyToOne(() => User, (user) => user.createdPolls)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options!: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll, { cascade: true })
  votes!: Vote[];

  // Helper to get total votes
  get totalVotes(): number {
    return this.votes?.length || 0;
  }
}