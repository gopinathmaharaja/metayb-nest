import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBikeDto {
  @ApiProperty({ description: 'Brand of the bike' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'Model of the bike' })
  @IsString()
  readonly model: string;

  @ApiProperty({ description: 'Price of the bike' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: 'Assembly time in minutes' })
  @IsNumber()
  readonly assemblyTime: number;
}


