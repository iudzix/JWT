import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { safeUnlinkByRelativePath } from 'src/common/utils/file.utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  private toPublicImagePath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/');
    return normalized.replace(/^\.?\/?uploads\//, '').replace(/^uploads\//, '');
  }

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const diskPath = file?.path?.replace(/\\/g, '/');
    const imageUrl = diskPath ? this.toPublicImagePath(diskPath) : undefined;

    try {
      return await this.productModel.create({
        ...dto,
        ...(imageUrl ? { imageUrl } : {}),
      });
    } catch (err) {
      if (diskPath) await safeUnlinkByRelativePath(diskPath);
      throw new InternalServerErrorException('Create product failed');
    }
  }

  async findAll(query: any): Promise<Product[]> {
    const { name, minPrice, maxPrice, sort } = query;

    let filter: any = {};

    // ค้นหาด้วยชื่อ (ใช้ Regex เพื่อให้หาได้แม้พิมพ์แค่บางส่วน และไม่สนตัวพิมพ์เล็กใหญ่)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // กรองตามช่วงราคา
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // จัดการการเรียงลำดับ
    const sortOrder = sort === 'price_asc' ? 1 : -1;

    return this.productModel.find(filter).sort({ price: sortOrder }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // --- แก้ไขข้อมูล (Update) - เพิ่มการรับ file เข้ามา ---
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const diskPath = file?.path?.replace(/\\/g, '/');
    const imageUrl = diskPath ? this.toPublicImagePath(diskPath) : undefined;

    try {
      // รวมข้อมูล DTO และรูปภาพใหม่ (ถ้ามี)
      const updateData = {
        ...updateProductDto,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return updatedProduct;
    } catch (err) {
      // ถ้าเกิด Error ในขั้นตอนบันทึก แต่มีไฟล์ถูกอัปโหลดขึ้นมาแล้ว ให้ลบไฟล์ทิ้งเพื่อไม่ให้รก Server
      if (diskPath) await safeUnlinkByRelativePath(diskPath);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Update product failed');
    }
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }
}