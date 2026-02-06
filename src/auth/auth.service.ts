// src/auth/auth.service.ts 

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'; 

import { UsersService } from '../users/users.service'; 

import { JwtService } from '@nestjs/jwt'; 

import { AuthDto } from './dto/auth.dto'; 

import * as argon2 from 'argon2'; 

 

@Injectable() 

export class AuthService { 

    constructor( 

        private usersService: UsersService, 

        private jwtService: JwtService, 

    ) { } 

 

    private normalizeEmail(email: string) { 

        return email.trim().toLowerCase(); // ตัดช่องว่างและแปลงเป็นตัวพิมพ์เล็ก

    } 

 

    async signUp(dto: AuthDto) { 

        const email = this.normalizeEmail(dto.email); // ทำให้ email เป็นมาตรฐานเดียวกัน

        const userExists = await this.usersService.findByEmail(email); // ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้วหรือไม่

        if (userExists) throw new BadRequestException('Email นี้ถูกใช้งานแล้ว'); // ถ้ามีผู้ใช้ที่มีอีเมลนี้อยู่แล้ว ให้ขว้างข้อผิดพลาด

 

        const passwordHash = await argon2.hash(dto.password); // แปลงรหัสให้อยู่ในรูปแบบแฮชเพื่อความปลอดภัย โดยใช้ไลบรารี argon2

 

        const newUser = await this.usersService.create({ 

            email, 

            passwordHash, 

        });       // สร้างผู้ใช้ใหม่ในฐานข้อมูล

 

        return this.signToken(String(newUser._id), newUser.email); // สร้างโทเคนขึ้นมา 1 ตัว 

    } 

 

    async signIn(dto: AuthDto) { 

        const email = this.normalizeEmail(dto.email); // ทำให้ email เป็นมาตรฐานเดียวกัน

 

        const user = await this.usersService.findByEmailWithPassword(email); // ค้นหาผู้ใช้ตามอีเมลพร้อมรหัสผ่านที่แฮชแล้ว

        if (!user) throw new UnauthorizedException('อีเมลไม่ถูกต้อง'); // ถ้าไม่พบผู้ใช้ ให้ขว้างข้อผิดพลาด

 

        const passwordMatches = await argon2.verify(user.passwordHash, dto.password); // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่

        if (!passwordMatches) throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง'); // ถ้ารหัสผ่านไม่ตรงกัน ให้ขว้างข้อผิดพลาด

 

        return this.signToken(String(user._id), user.email); // สร้างโทเคนขึ้นมา 1 ตัว

    } 

 

    async signToken(userId: string, email: string) { 

        const payload = { sub: userId, email }; 

        const token = await this.jwtService.signAsync(payload); 

 

        return { 

            access_token: token, 

        }; 

    } 

} 