import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'The unique username for the user',
    example: 'john_doe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'A valid email address',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user (at least 6 characters)',
    example: 'securePassword123',
  })
  @MinLength(6)
  password: string;
}