// src/app.module.ts 

import { Module } from '@nestjs/common'; 

/*import { AppController } from './app.controller'; 

import { AppService } from './app.service'; */ //สองอันนี้ตัดออกไม่ได้ใช้

import { ConfigModule, ConfigService } from '@nestjs/config'; 

import { MongooseModule } from '@nestjs/mongoose'; 

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // นำเข้า ThrottlerModule และ ThrottlerGuard สำหรับการตั้งค่า rate limiting
import { APP_GUARD } from '@nestjs/core'; // นำเข้า APP_GUARD เพื่อใช้ตั้งค่า global guard


import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { ProductsModule } from './products/products.module';
 

@Module({ 

  imports: [ConfigModule.forRoot({ 

    isGlobal: true, 

  }), 
  
  // ตั้งค่า rate limiting โดยใช้ ThrottlerModule 
  ThrottlerModule.forRoot([
    {
      ttl: 60_000,  // 1 minute
      limit: 100,   // 100 requests per minute
    },
  ]),

  
  MongooseModule.forRootAsync({ 

    imports: [ConfigModule], 

    inject: [ConfigService], 

    useFactory: (configService: ConfigService) => ({ 

      uri: configService.get<string>('MONGO_URI'), 

    }), 

  }), UsersModule, AuthModule, ProductsModule], 

  /*controllers: [AppController], 

  providers: [AppService], */ //สองอันนี้ตัดออกไม่ได้ใช้

  // *** สำหรับการตั้งค่า global guard กรณีกันโดนยิง API รัว ๆ ทั้งระบบ ThrottlerGuard ***
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],


}) 

export class AppModule { } 