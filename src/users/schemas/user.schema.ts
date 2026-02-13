// src/users/schemas/user.schema.ts 

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 

import { HydratedDocument } from 'mongoose'; 

 

export type UserDocument = HydratedDocument<User>; 
export type UserRole = 'user' | 'admin';  // สามารถกำหนดประเภทผู้ใช้ในฐานข้อมูลได้

 

@Schema({ timestamps: true }) 

export class User { 

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) //unique ห้ามซ้ำ , trim ตัดช่องว่าง , index สร้างดัชนีเพื่อเพิ่มความเร็วในการค้นหา
    email: string; 


    @Prop({ required: true, select: false }) //select ซ่อนข้อมูลไม่ให้แสดงเวลา query
    passwordHash: string; 

    @Prop({ required: true, default: 'user' }) // กำหนดค่าเริ่มต้นเป็น 'user'
    role: UserRole;
    
    @Prop({ type: String, select: false, default: null }) //select ซ่อนข้อมูลไม่ให้แสดงเวลา query
    refreshTokenHash?: string | null;


} 

 

export const UserSchema = SchemaFactory.createForClass(User); 