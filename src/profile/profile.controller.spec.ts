import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;
  let jwtService: JwtService;

  const mockProfileService = {
    createProfile: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ userId: '123' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a profile', async () => {
    const createProfileDto = {
      name: 'John Doe',
      birthday: '20 May 2001',
      height: 175,
      weight: 70,
      interests: ['Games', 'Music'],
    };

    mockProfileService.createProfile.mockResolvedValue({ statusCode: 201, message: 'Profile created' });
    
    const result = await controller.createProfile(createProfileDto, 'Bearer Token');
    
    expect(result.statusCode).toBe(201);
    expect(service.createProfile).toHaveBeenCalledWith(createProfileDto, '123');
  });

  it('should get a profile', async () => {
    const mockProfile = {
      userId: '123',
      name: 'John Doe',
      birthday: '20 May 2001',
      height: 175,
      weight: 70,
    };

    mockProfileService.getProfile.mockResolvedValue(mockProfile);
    
    const result = await controller.getProfile('Bearer Token');
    
    expect(result).toEqual(mockProfile);
    expect(service.getProfile).toHaveBeenCalledWith('123');
  });

  it('should update a profile', async () => {
    const updateProfileDto = { name: 'Jane Doe', height: 180 };
    const mockFile = { filename: 'test.jpg' };

    mockProfileService.updateProfile.mockResolvedValue({ statusCode: 200, message: 'Profile updated' });
    
    const result = await controller.updateProfile(updateProfileDto, 'Bearer Token', mockFile as Express.Multer.File);
    
    expect(result.statusCode).toBe(200);
    expect(service.updateProfile).toHaveBeenCalledWith('123', expect.objectContaining({
      ...updateProfileDto,
      imageUrl: expect.stringContaining('test.jpg')
    }));
  });

  it('should throw BadRequestException when creating a profile fails', async () => {
    const createProfileDto = {
      name: 'John Doe',
      birthday: '20 May 2001',
      height: 175,
      weight: 70,
      interests: ['Games', 'Music'],
    };

    mockProfileService.createProfile.mockRejectedValue(new BadRequestException('Invalid data'));

    await expect(controller.createProfile(createProfileDto, 'Bearer Token')).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when getting a profile fails', async () => {
    mockProfileService.getProfile.mockRejectedValue(new NotFoundException('Profile not found'));

    await expect(controller.getProfile('Bearer Token')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when updating a non-existent profile', async () => {
    const updateProfileDto = { name: 'Jane Doe', height: 180 };

    mockProfileService.updateProfile.mockRejectedValue(new NotFoundException('Profile not found'));

    await expect(controller.updateProfile(updateProfileDto, 'Bearer Token', null)).rejects.toThrow(NotFoundException);
  });
});