import { Controller, Delete, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('moderation')
@ApiBearerAuth()
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Delete('listings/:id')
  @Roles('MODERATOR', 'ADMIN')
  deleteListing(@Param('id') id: string) {
    return this.moderationService.deleteListing(id);
  }

  @Post('forum/:id/lock')
  @Roles('MODERATOR', 'ADMIN')
  lockTopic(@Param('id') id: string) {
    return this.moderationService.lockTopic(id);
  }

  @Post('forum/:id/unlock')
  @Roles('MODERATOR', 'ADMIN')
  unlockTopic(@Param('id') id: string) {
    return this.moderationService.unlockTopic(id);
  }

  @Post('forum/:id/pin')
  @Roles('MODERATOR', 'ADMIN')
  pinTopic(@Param('id') id: string) {
    return this.moderationService.pinTopic(id);
  }

  @Delete('comments/:id')
  @Roles('MODERATOR', 'ADMIN')
  deleteComment(@Param('id') id: string) {
    return this.moderationService.deleteComment(id);
  }
}
