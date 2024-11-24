import { CONSTANTS } from './common/helper';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { pinoHttpOptions } from './pino-config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/jwt.strategy';
import { BikeModule } from './module/bikes/bike.module';
import { UserModule } from './module/users/user.module';
import { AssemblyModule } from './module/assemblies/assembly.module';
import { AgendaModule } from './module/agenda/agenda.module';

@Module({
  imports: [
    PassportModule,
    LoggerModule.forRoot({ pinoHttp: pinoHttpOptions }),
    MongooseModule.forRoot(CONSTANTS.MONGODB_URI),
    BikeModule,
    UserModule,
    AssemblyModule,
    AgendaModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [PassportModule],
})
export class AppModule {}
