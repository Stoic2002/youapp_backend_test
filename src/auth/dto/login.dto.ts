import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email of the user',
    example: 'john_doe or johndoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'securePassword123',
  })
  @IsNotEmpty()
  password: string;
}