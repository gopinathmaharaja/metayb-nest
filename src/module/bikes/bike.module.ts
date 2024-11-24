import { Module } from '@nestjs/common';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bike, BikeSchema } from './schema/bike.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bike.name, schema: BikeSchema }]),
  ],
  controllers: [BikeController],
  providers: [BikeService],
  exports: [BikeService],
})
export class BikeModule {}
