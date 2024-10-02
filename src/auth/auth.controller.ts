import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectId, Types } from 'mongoose';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService : JwtService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully', schema: { example: { username: 'john_doe', email: 'johndoe@example.com', password: 'securePassword123' }}})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }}})
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('getUser')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Profile fetched successfully.', type: User })
  @ApiHeader({ name: 'x-access-token', description: 'JWT token for authentication' })
  async getUser(@Headers('x-access-token') token: string){
    const userId: string = this.jwtService.verify(token).userId;
    const id: Types.ObjectId = Object(userId);

  return this.authService.getUser(id);
  }
}