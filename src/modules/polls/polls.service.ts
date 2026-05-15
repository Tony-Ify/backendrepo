import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { CreatePollDto, UpdatePollDto, UpdatePollStatusDto } from './poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private pollOptionRepository: Repository<PollOption>,
  ) {}

  async create(userId: number, createPollDto: CreatePollDto): Promise<Poll> {
    const poll = this.pollsRepository.create({
      title: createPollDto.title,
      description: createPollDto.description,
      createdById: userId,
    });

    const savedPoll = await this.pollsRepository.save(poll);

    if (createPollDto.options && createPollDto.options.length > 0) {
      const options = createPollDto.options.map((opt, index) =>
        this.pollOptionRepository.create({
          optionText: opt.optionText,
          displayOrder: index,
          pollId: savedPoll.id,
        }),
      );
      await this.pollOptionRepository.save(options);
    }

    return this.findById(savedPoll.id);
  }

  async findById(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'options', 'votes'],
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    return poll;
  }

  async findAll(status?: 'active' | 'closed'): Promise<Poll[]> {
    const query = this.pollsRepository.createQueryBuilder('poll')
      .leftJoinAndSelect('poll.createdBy', 'createdBy')
      .leftJoinAndSelect('poll.options', 'options')
      .leftJoinAndSelect('poll.votes', 'votes')
      .orderBy('poll.createdAt', 'DESC');

    if (status) {
      query.where('poll.status = :status', { status });
    }

    return query.getMany();
  }

  async findActive(): Promise<Poll[]> {
    return this.findAll('active');
  }

  async findClosed(): Promise<Poll[]> {
    return this.findAll('closed');
  }

  async update(
    id: number,
    userId: number,
    updatePollDto: UpdatePollDto,
  ): Promise<Poll> {
    const poll = await this.findById(id);

    if (poll.createdById !== userId) {
      throw new ForbiddenException('You can only edit your own polls');
    }

    poll.title = updatePollDto.title;
    poll.description = updatePollDto.description;

    if (updatePollDto.options) {
      await this.pollOptionRepository.delete({ pollId: id });

      const options = updatePollDto.options.map((opt, index) =>
        this.pollOptionRepository.create({
          optionText: opt.optionText,
          displayOrder: index,
          pollId: id,
        }),
      );
      await this.pollOptionRepository.save(options);
    }

    return this.pollsRepository.save(poll);
  }

  async updateStatus(
    id: number,
    userId: number,
    updateStatusDto: UpdatePollStatusDto,
  ): Promise<Poll> {
    const poll = await this.findById(id);

    if (poll.createdById !== userId) {
      throw new ForbiddenException('You can only update your own polls');
    }

    poll.status = updateStatusDto.status;
    if (updateStatusDto.status === 'closed') {
      poll.closedAt = new Date();
    }

    return this.pollsRepository.save(poll);
  }

  async delete(id: number, userId: number): Promise<void> {
    const poll = await this.findById(id);

    if (poll.createdById !== userId) {
      throw new ForbiddenException('You can only delete your own polls');
    }

    await this.pollsRepository.remove(poll);
  }

  async getPollOption(id: number): Promise<PollOption> {
    const option = await this.pollOptionRepository.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException('Poll option not found');
    }
    return option;
  }

  async getPollOptions(pollId: number): Promise<PollOption[]> {
    return this.pollOptionRepository.find({
      where: { pollId },
      order: { displayOrder: 'ASC' },
    });
  }
}