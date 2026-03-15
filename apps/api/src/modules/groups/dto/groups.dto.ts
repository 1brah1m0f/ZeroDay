import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';

const COMMUNITY_TYPES = ['TECH', 'EDUCATION', 'NONPROFIT', 'BUSINESS', 'OTHER'] as const;
const COMMUNITY_PRIVACY = ['PUBLIC', 'PRIVATE', 'INVITE_ONLY'] as const;
const MEMBER_ROLES = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'] as const;
const INVITE_CHANNELS = ['PLATFORM', 'EMAIL', 'SMS'] as const;
const CHANNEL_TYPES = ['TEXT', 'EVENT', 'ANNOUNCEMENT'] as const;

export class CommunitiesQueryDto {
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
  @IsIn(COMMUNITY_TYPES as unknown as string[])
  type?: string;
}

export class CommunityDetailsQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
}

export class CreateGroupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(COMMUNITY_TYPES as unknown as string[])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(COMMUNITY_PRIVACY as unknown as string[])
  privacy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(COMMUNITY_TYPES as unknown as string[])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(COMMUNITY_PRIVACY as unknown as string[])
  privacy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class MembersQueryDto {
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
  @IsIn(MEMBER_ROLES as unknown as string[])
  role?: string;
}

export class UpdateMemberRoleDto {
  @IsString()
  @IsIn(MEMBER_ROLES as unknown as string[])
  role: string;
}

export class AnnouncementsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  body: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsString()
  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxAttendees?: number;
}

export class SearchInviteDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPoints?: number;

  @IsOptional()
  @IsString()
  q?: string;
}

export class SendInvitationDto {
  @IsString()
  receiverId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;

  @IsOptional()
  @IsString()
  @IsIn(INVITE_CHANNELS as unknown as string[])
  channel?: string;
}

export class BulkInvitationsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  receiverIds: string[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}

export class RespondInvitationDto {
  @IsBoolean()
  accept: boolean;
}

export class CreateChannelDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(CHANNEL_TYPES as unknown as string[])
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}

export class ChannelMessagesQueryDto {
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

export class SendChannelMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string;
}
