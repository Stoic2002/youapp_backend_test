import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '02 July 2002',
    description: 'Birthday of the user',
  })
  @IsDateString()
  birthday: string;

  @ApiProperty({
    example: 175,
    description: 'Height of the user in cm',
  })
  @IsString()
  @IsNotEmpty()
  height: Number;

  @ApiProperty({
    example: 70,
    description: 'Weight of the user in kg',
  })
  @IsString()
  @IsNotEmpty()
  weight: Number;

  @ApiProperty({
    example: 'Game, Music',
    description: 'Interests of the user',
  })
  @IsString()
  @IsOptional()
  interests: string[];

}