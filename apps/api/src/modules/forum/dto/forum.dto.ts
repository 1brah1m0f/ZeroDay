import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class TopicsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}

export class CreateTopicDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(10000)
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  body: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class VoteDto {
  @Type(() => Number)
  @IsInt()
  @IsIn([1, -1])
  value: 1 | -1;
}
