// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy'; // นำเข้า RefreshStrategy

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    /*JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRATION') ?? '3600', 10),// 1 hour จาก config ที่อยู่ใน .env เพื่อกำหนดเวลา หมดอายุของโทเคน
        },
      }),
    }),*/
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy], // เพิ่ม RefreshStrategy ใน providers
})
export class AuthModule { }
