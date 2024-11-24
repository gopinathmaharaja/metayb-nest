import { Module } from '@nestjs/common';
import { Agenda } from 'agenda';
import { CONSTANTS } from 'src/common/helper';
import { AgendaService } from './agenda.service';

@Module({
  providers: [
    AgendaService,
    {
      provide: 'AGENDA',
      useFactory: async () => {
        const mongoUri = CONSTANTS.MONGODB_URI;
        const agenda = new Agenda({ db: { address: mongoUri, collection: 'agendaJobs' } });
        await agenda.start();
        return agenda;
      },
    },
  ],
  exports: ['AGENDA'],
})
export class AgendaModule {}
