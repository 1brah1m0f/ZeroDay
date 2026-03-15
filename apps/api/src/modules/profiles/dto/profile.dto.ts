import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const EXPERIENCE_TYPES = ['WORK', 'EDUCATION', 'VOLUNTEER'] as const;

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}

export class CreateExperienceDto {
  @IsOptional()
  @IsString()
  @IsIn(EXPERIENCE_TYPES as unknown as string[])
  type?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  organization: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCurrent?: boolean;
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  @IsIn(EXPERIENCE_TYPES as unknown as string[])
  type?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  organization?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCurrent?: boolean;
}
