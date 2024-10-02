import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { calculateHoroscopeAndZodiac } from './utils';
import { Message } from '../chat/schemas/message.schema';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<Profile>) {}

  async createProfile(createProfileDto: CreateProfileDto, userId: string){
    const { birthday } = createProfileDto;
    const { horoscope, zodiac } = calculateHoroscopeAndZodiac(birthday);

    const profile = new this.profileModel({ ...createProfileDto, horoscope, zodiac, userId });
    return {
      statusCode: 201,
      message: "profile created",
      data: {
          userId: profile.userId,
          name: profile.name,
          birthday: profile.birthday,
          horoscope: profile.horoscope,
          zodiac: profile.zodiac,
          height: profile.height,
          weight: profile.weight,
          interests: profile.interests
        
      }
    };
  }

  async getProfile(userId: string): Promise<Profile> {
    return this.profileModel.findOne({ userId });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const currentProfile = await this.profileModel.findOne({ userId });

    if (!currentProfile) {
        throw new Error('Profile not found.');
    }

    if (updateProfileDto.birthday) {
        const { horoscope, zodiac } = calculateHoroscopeAndZodiac(updateProfileDto.birthday);
        updateProfileDto.horoscope = horoscope;
        updateProfileDto.zodiac = zodiac;
    }

    const profile = await this.profileModel.findOneAndUpdate({ userId }, updateProfileDto, { new: true });
    return {
      statusCode : 200,
      message : 'updated',
      data : {
        name:  profile.name,
        birthday:  profile.birthday,
        horoscope:  profile.horoscope,
        zodiac:  profile.zodiac,
        height:  profile.height,
        weight:  profile.weight,
        interest: profile.interests,
        imageUrl:  profile.imageUrl
      }
    }
}
}