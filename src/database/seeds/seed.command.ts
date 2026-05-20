import{ Command, CommandRunner} from 'nest-commander';
import { InitSeeder } from './init.seeder';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly initSeeder: InitSeeder) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.initSeeder.run();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  }
}

function Command(arg0: { name: string; description: string; }): (target: typeof SeedCommand) => void | typeof SeedCommand {
    throw new Error('Function not implemented.');
}
