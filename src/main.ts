// src/main.ts 

import { NestFactory } from '@nestjs/core'; 

import { AppModule } from './app.module'; 

import { ValidationPipe } from '@nestjs/common'; 

 

async function bootstrap() { 

  const app = await NestFactory.create(AppModule); 

  app.enableCors(); 

  app.useGlobalPipes( 

    new ValidationPipe({ 

      whitelist: true, // กำจัดฟิลด์ที่ไม่ได้ระบุไว้ใน DTO ออกไป

      forbidNonWhitelisted: true, // ขว้างข้อผิดพลาดถ้ามีฟิลด์ที่ไม่ได้ระบุใน DTO

      transform: true, 

    }), 

  ); 

  await app.listen(process.env.PORT ?? 3000); 

} 

bootstrap(); 