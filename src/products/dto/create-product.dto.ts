// src/products/dto/create-product.dto.ts
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsUrl, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // แปลงจาก form-data (string) เป็น number
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' }) // ตรวจว่าเป็น URL หรือไม่ (ใส่หรือไม่ใส่ก็ได้)
  imageUrl?: string;

  @IsString({ each: true })
  @IsOptional()
  @IsArray()
  color: string[];
}
