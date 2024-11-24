import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Assembly, AssemblySchema } from './schema/assembly.schema';
import { AgendaService } from '../agenda/agenda.service';
import { AgendaModule } from '../agenda/agenda.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assembly.name, schema: AssemblySchema },
    ]),
    AgendaModule,
  ],
  controllers: [AssemblyController],
  providers: [AssemblyService, AgendaService],
  exports: [AssemblyService],
})
export class AssemblyModule {}
