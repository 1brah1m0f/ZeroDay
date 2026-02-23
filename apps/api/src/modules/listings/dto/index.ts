import { IsString, IsOptional, IsEnum, IsArray, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetListingsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  q?: string;
}

export class CreateListingDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: ['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER'] })
  @IsEnum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER'] as const)
  category: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdateListingDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  @IsOptional()
  description?: string;

  @IsEnum(['VOLUNTEER', 'EDUCATION', 'JOBS', 'SERVICES', 'EVENTS', 'OTHER'] as const)
  @IsOptional()
  category?: string;

  @IsEnum(['ACTIVE', 'CLOSED', 'DRAFT'] as const)
  @IsOptional()
  status?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
