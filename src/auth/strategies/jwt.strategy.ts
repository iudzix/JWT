// src/auth/strategies/jwt.strategy.ts 

import { Injectable } from '@nestjs/common'; 

import { PassportStrategy } from '@nestjs/passport'; 

import { ExtractJwt, Strategy } from 'passport-jwt'; 

import { ConfigService } from '@nestjs/config'; 

 

type JwtPayload = { sub: string; email: string; role: string  }; // เพิ่ม role ใน payload

 

@Injectable() 

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {  

    constructor(config: ConfigService) { 
        super({ 

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ดึงโทเคนจากส่วนหัวของคำขอแบบ Bearer

            ignoreExpiration: false, //ถ้า Token หมดอายุ จะโดน 401 ทันที

            secretOrKey: config.get<string>('JWT_ACCESS_SECRET') || '', //จุดนี้ต้องตรงกับตอนสร้าง Token

        }); 

    } 

 

    validate(payload: JwtPayload) { 

        return { userId: payload.sub, email: payload.email, role: payload.role  }; // เพิ่ม role ในข้อมูลที่ส่งกลับ

    } 

} 