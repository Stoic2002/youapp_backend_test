import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { username, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException({
        status: 'error',
        message: 'Email already exists',
        errors: [
          { field: 'email', message: 'This email is already registered' }
        ]
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      status: 'success',
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { usernameOrEmail, password } = loginDto;

    // Find user by email or username
    const user = await this.userModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Invalid credentials',
        errors: [
          { field: 'usernameOrEmail', message: 'Username or email is incorrect' },
          { field: 'password', message: 'Password is incorrect' }
        ]
      });
    }

    const token = this.jwtService.sign({ userId: user._id });
    return {
      status: 'success',
      message: 'Login successful',
      access_token: token
    };
  }

  async getUser(_id: Types.ObjectId){
    const user = await this.userModel.findById({ _id });
    return {
      statusCode : 200,
      message : 'get profile success',
      data : {
        username : user.username,
        email : user.email
      } 
    };
  }
}