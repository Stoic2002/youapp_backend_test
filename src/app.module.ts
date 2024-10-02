import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile/profile.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'), 
        serveRoot: '/uploads', 
    }),
    ConfigModule.forRoot({isGlobal :true}),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    ProfileModule,
    ChatModule,
  ],
})
export class AppModule {}