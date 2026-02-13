import { Controller, Get, Post, Body, Patch, Param, Delete, MaxFileSizeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_IMAGE } from './products.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')


  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (dto.color && typeof dto.color === 'string') {
      dto.color = [dto.color];
    }
    return this.productsService.create(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: PRODUCT_IMAGE.MAX_SIZE }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (dto.color) {
      if (typeof dto.color === 'string') {
        dto.color = dto.color.trim() === '' ? [] : [dto.color];
      }
    } else {
      dto.color = [];
    }

    if (dto.price) dto.price = Number(dto.price);

    return this.productsService.update(id, dto as UpdateProductDto, file);
  }

  @Get()
  // ใช้ @Query() เพื่อรับค่าทั้งหมดที่ส่งมาหลังเครื่องหมาย ? ใน URL
  findAll(
    @Query()
    query: {
      name?: string;
      minPrice?: string;
      maxPrice?: string;
      sort?: string;
    },
  ) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}