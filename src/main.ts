// src/main.ts 

import { NestFactory } from '@nestjs/core'; 

import { AppModule } from './app.module'; 

import { ValidationPipe } from '@nestjs/common'; 

import helmet from 'helmet'; // เพิ่มความปลอดภัยให้กับแอปพลิเคชันด้วยการตั้งค่า HTTP headers

 

async function bootstrap() { 

  const app = await NestFactory.create(AppModule); 

  app.enableCors();  // เปิดใช้งาน CORS เพื่อให้แอปพลิเคชันสามารถรับคำขอจากโดเมนอื่นได้

  app.use(helmet()); // ใช้ helmet เพื่อเพิ่มความปลอดภัย

  app.useGlobalPipes(  // ใช้ ValidationPipe ทั่วทั้งแอปพลิเคชันเพื่อทำการตรวจสอบและแปลงข้อมูลที่เข้ามา

    new ValidationPipe({ 

      whitelist: true, // กำจัดฟิลด์ที่ไม่ได้ระบุไว้ใน DTO ออกไป

      forbidNonWhitelisted: true, // ขว้างข้อผิดพลาดถ้ามีฟิลด์ที่ไม่ได้ระบุใน DTO

      transform: true, 

    }), 

  ); 

  await app.listen(process.env.PORT ?? 3000); 

} 

bootstrap(); 