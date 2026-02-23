import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(50)
    displayName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(160)
    bio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
