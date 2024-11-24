import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BikeDocument = Bike & Document;

@Schema({ timestamps: true })
export class Bike {
  @Prop({ required: true, unique: true, index: true })
  brand: string;

  @Prop({ required: true, index: true })
  model: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, index: true })
  assemblyTime: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BikeSchema = SchemaFactory.createForClass(Bike);
