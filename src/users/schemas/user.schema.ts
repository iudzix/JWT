// src/users/schemas/user.schema.ts 

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'; 

import { HydratedDocument } from 'mongoose'; 

 

export type UserDocument = HydratedDocument<User>; 

 

@Schema({ timestamps: true }) 

export class User { 

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true }) //unique ห้ามซ้ำ , trim ตัดช่องว่าง , index สร้างดัชนีเพื่อเพิ่มความเร็วในการค้นหา

    email: string; 

 

    @Prop({ required: true, select: false }) //select ซ่อนข้อมูลไม่ให้แสดงเวลา query

    passwordHash: string; 

} 

 

export const UserSchema = SchemaFactory.createForClass(User); 