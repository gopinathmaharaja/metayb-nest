import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAssemblyDto {
  @ApiProperty({ description: 'Bike ID associated with the assembly' })
  @IsString()
  readonly bikeId: string;

  @ApiProperty({ description: 'Name of the assembly' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Duration time in minutes' })
  @IsNumber()
  readonly duration: number;

  userId: any;
  startTime: Date;
  endTime: Date;
  status: string;
}
