import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'First Name of the user' })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty({ description: 'Last Name of the user' })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiProperty({ description: 'Role of the user' })
  @IsString()
  @IsOptional()
  readonly role?: string;
}

export class LoginUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  readonly password: string;
}


