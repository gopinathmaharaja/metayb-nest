import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type AssemblyDocument = Assembly & Document;

@Schema({ timestamps: true })
export class Assembly {
  @Prop({
    required: true,
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    index: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Bike',
    index: true,
  })
  bikeId: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: true })
  startTime: Date;

  @Prop({ index: true })
  endTime: Date;

  @Prop()
  duration: number;

  @Prop({
    enum: ['processing', 'completed'],
    default: 'processing',
    index: true,
  })
  status: string;
}

export const AssemblySchema = SchemaFactory.createForClass(Assembly);
