import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ChatMessagesQueryDto {
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
}

export class SendMessageDto {
  @IsString()
  recipientId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string;
}

export class SendConversationMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string;
}
