import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { Agenda } from 'agenda';

@Injectable()
export class AgendaService implements OnModuleDestroy {
  constructor(@Inject('AGENDA') private readonly agenda: Agenda) {}

  defineJob(name: string, jobHandler: (job: any) => Promise<void>) {
    this.agenda.define(name, async (job) => {
      await jobHandler(job);
    });
  }

  async scheduleJob(name: string, when: Date, data?: any) {
    await this.agenda.schedule(when, name, data);
  }

  async onModuleDestroy() {
    await this.agenda.stop();
  }
}
