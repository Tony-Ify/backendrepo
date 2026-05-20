import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';
import { PollOption } from '@/modules/polls/entities/poll-option.entity';
import * as bcrypt from 'bcryptjs';
import { Poll } from '@/modules/polls/entities/poll.entity';

@Injectable()
export class InitSeeder {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private pollOptionsRepository: Repository<PollOption>,
  ) {}

  async run() {
    await this.seedUsers();
    await this.seedPolls();
    console.log('✅ Database seeding completed');
  }

  async seedUsers() {
    // Check if admin already exists
    const adminExists = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (adminExists) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = this.usersRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      state: 'LAGOS',
      role: 'admin',
    });

    await this.usersRepository.save(admin);
    console.log('✓ Admin user created');

    // Regular users for testing
    const regularUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        state: 'LAGOS',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        state: 'ABUJA',
      },
      {
        name: 'Chioma Williams',
        email: 'chioma@example.com',
        state: 'ENUGU',
      },
      {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        state: 'KANO',
      },
      {
        name: 'Blessing Okonkwo',
        email: 'blessing@example.com',
        state: 'PORTHARCOURT',
      },
    ];

    for (const userData of regularUsers) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        role: 'user',
      });
      await this.usersRepository.save(user);
    }

    console.log(`✓ ${regularUsers.length} regular users created`);
  }

  async seedPolls() {
    // Check if polls already exist
    const pollCount = await this.pollsRepository.count();
    if (pollCount > 0) {
      console.log(`✓ ${pollCount} polls already exist`);
      return;
    }

    const admin = await this.usersRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!admin) {
      throw new Error('Admin user not found');
    }

    const polls = [
      {
        title: 'What is your favorite programming language?',
        description: 'Vote for the programming language you prefer to work with',
        options: ['JavaScript', 'Python', 'Java', 'TypeScript'],
      },
      {
        title: 'Which frontend framework do you prefer?',
        description: 'Choose your favorite frontend framework for web development',
        options: ['Angular', 'React', 'Vue', 'Svelte'],
      },
      {
        title: 'Best backend framework?',
        description: 'Vote for your preferred backend framework',
        options: ['NestJS', 'Django', 'Spring Boot', 'Express'],
      },
      {
        title: 'Preferred database?',
        description: 'Choose your go-to database for applications',
        options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Firebase'],
      },
      {
        title: 'Best code editor?',
        description: 'Which code editor do you use most often?',
        options: ['VS Code', 'WebStorm', 'Sublime', 'Vim'],
      },
    ];

    for (const pollData of polls) {
      const poll = this.pollsRepository.create({
        title: pollData.title,
        description: pollData.description,
        createdBy: admin,
        status: 'active',
      });

      const savedPoll = await this.pollsRepository.save(poll);

      for (let i = 0; i < pollData.options.length; i++) {
        const option = this.pollOptionsRepository.create({
          poll: savedPoll,
          optionText: pollData.options[i],
          displayOrder: i,
        });
        await this.pollOptionsRepository.save(option);
      }
    }

    console.log(`✓ ${polls.length} polls with options created`);
  }
}