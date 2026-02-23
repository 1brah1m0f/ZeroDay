import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BadgesService } from './badges.service';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('user/:userId')
  getUserBadges(@Param('userId') userId: string) {
    return this.badgesService.getUserBadges(userId);
  }
}
