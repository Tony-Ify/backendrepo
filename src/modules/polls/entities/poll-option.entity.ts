import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer' })
  pollId!: number;

  @Column({ type: 'varchar', length: 255 })
  optionText!: string;

  @Column({ type: 'integer', nullable: true })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Poll, poll => poll.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @OneToMany(() => Vote, vote => vote.option, { cascade: true })
  votes!: Vote[];
}