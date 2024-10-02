import { Controller, Get, Post, Put, Body, Headers, Param, Request, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto,  } from './dto/create-profile.dto';
import {  UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './schemas/profile.schema';
import { ApiTags, ApiResponse, ApiHeader, ApiConsumes, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Profile')
@Controller('api')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly jwtService : JwtService) {}

  @Post('createProfile')
  @ApiResponse({ status: 201, description: 'Profile created successfully.', type: Profile })
  @ApiHeader({ name: 'x-access-token', description: 'JWT token for authentication' })
  async createProfile(@Body() createProfileDto: CreateProfileDto, @Headers('x-access-token') token: string){
    const userId = this.jwtService.verify(token).userId;
    return this.profileService.createProfile(createProfileDto, userId );
  }

  @Get('getProfile')
  @ApiResponse({ status: 200, description: 'Profile fetched successfully.', type: Profile })
  @ApiHeader({ name: 'x-access-token', description: 'JWT token for authentication' })
  async getProfile(@Headers('x-access-token') token: string): Promise<Profile> {
    const userId = this.jwtService.verify(token).userId;
    return this.profileService.getProfile(userId);
  }

  @Put('updateProfile')
  @ApiResponse({ status: 200, description: 'Profile updated successfully.', type: Profile })
  @ApiHeader({ name: 'x-access-token', description: 'JWT token for authentication' })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        birthday: {
            type: 'string',
            description: 'Birthday of the user in "DD MM YYYY"',
          },
        height: { type: 'number' },
        weight: { type: 'number' },
        interests: { type: 'array', items :{type : 'string'} },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Headers('x-access-token') token: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = this.jwtService.verify(token).userId;

    const currentProfile = await this.profileService.getProfile(userId);

    if (currentProfile) {
        const oldImageUrl = currentProfile.imageUrl;
      
        if (oldImageUrl) {
          const oldImagePath = `./uploads/${oldImageUrl.split('/').pop()}`;
    
          if (existsSync(oldImagePath)) {
            unlinkSync(oldImagePath);
          }
        }
      
        updateProfileDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
      } else {
        throw new Error('Profile not found.');
      }

    return this.profileService.updateProfile(userId, updateProfileDto);
  }
}
