import { IsOptional, IsString, IsDateString, IsNumber, isNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '02 July 2002',
    description: 'Birthday of the user',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiProperty({
    example: 175,
    description: 'Height of the user in cm',
    required: false,
  })
  @IsOptional()
  height?: Number;

  @ApiProperty({
    example: 70,
    description: 'Weight of the user in kg',
    required: false,
  })
  @IsOptional()
  weight?: Number;

  @ApiProperty({
    example: 'Games, Music',
    description: 'Interests of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  interests?: string[];

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
  
  @IsOptional()
  @IsString()
  horoscope?: string;

  @IsOptional()
  @IsString()
  zodiac?: string;
}