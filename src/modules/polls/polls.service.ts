import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Poll, PollStatus } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { CreatePollDto, UpdatePollDto, UpdatePollStatusDto } from './poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
  ) {}

  async create(createPollDto: CreatePollDto, userId: number): Promise<Poll> {
    const { title, description, options } = createPollDto;

    const poll = this.pollsRepository.create({
      title,
      description,
      createdById: userId,
      status: PollStatus.ACTIVE,
    });

    const savedPoll = await this.pollsRepository.save(poll);

    // Create poll options
    const pollOptions = options.map((option, index) =>
      this.pollOptionsRepository.create({
        pollId: savedPoll.id,
        optionText: option.optionText,
        displayOrder: option.displayOrder || index,
      }),
    );

    savedPoll.options = await this.pollOptionsRepository.save(pollOptions);

    return savedPoll;
  }

  async findById(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: ['options', 'createdBy'],
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    return poll;
  }

  async findAll(status?: PollStatus): Promise<Poll[]> {
    const query = this.pollsRepository.createQueryBuilder('poll')
      .leftJoinAndSelect('poll.options', 'options')
      .leftJoinAndSelect('poll.createdBy', 'createdBy')
      .orderBy('poll.createdAt', 'DESC');

    if (status) {
      query.where('poll.status = :status', { status });
    }

    return await query.getMany();
  }

  async findActive(): Promise<Poll[]> {
    return await this.findAll(PollStatus.ACTIVE);
  }

  async findClosed(): Promise<Poll[]> {
    return await this.findAll(PollStatus.CLOSED);
  }

  async update(
    id: number,
    updatePollDto: UpdatePollDto,
    userId: number,
  ): Promise<Poll> {
    const poll = await this.findById(id);

    // Check if user is the creator or admin
    if (poll.createdById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this poll',
      );
    }

    const { title, description, options } = updatePollDto;

    if (title) poll.title = title;
    if (description) poll.description = description;

    const updatedPoll = await this.pollsRepository.save(poll);

    if (options) {
      // Delete existing options
      await this.pollOptionsRepository.delete({ pollId: id });

      // Create new options
      const newOptions = options.map((option, index) =>
        this.pollOptionsRepository.create({
          pollId: id,
          optionText: option.optionText,
          displayOrder: option.displayOrder || index,
        }),
      );

      updatedPoll.options = await this.pollOptionsRepository.save(newOptions);
    }

    return updatedPoll;
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdatePollStatusDto,
    userId: number,
  ): Promise<Poll> {
    const poll = await this.findById(id);

    // Check if user is the creator
    if (poll.createdById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this poll status',
      );
    }

    poll.status = updateStatusDto.status;
    if (updateStatusDto.status === PollStatus.CLOSED) {
      poll.closedAt = new Date();
    }

    return await this.pollsRepository.save(poll);
  }

  async delete(id: number, userId: number): Promise<void> {
    const poll = await this.findById(id);

    // Check if user is the creator
    if (poll.createdById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this poll',
      );
    }

    const result = await this.pollsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }
  }

  async getPollOption(optionId: number): Promise<PollOption> {
    const option = await this.pollOptionsRepository.findOne({
      where: { id: optionId },
    });

    if (!option) {
      throw new NotFoundException(`Poll option with ID ${optionId} not found`);
    }

    return option;
  }

  async getPollOptions(pollId: number): Promise<PollOption[]> {
    return await this.pollOptionsRepository.find({
      where: { pollId },
      order: { displayOrder: 'ASC' },
    });
  }
}