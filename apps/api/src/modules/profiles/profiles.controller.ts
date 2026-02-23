import {
  Controller, Get, Put, Post, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put()
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.profilesService.updateProfile(userId, dto);
  }

  @Get('experiences')
  getExperiences(@CurrentUser('id') userId: string) {
    return this.profilesService.getExperiences(userId);
  }

  @Post('experiences')
  addExperience(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.profilesService.addExperience(userId, dto);
  }

  @Put('experiences/:id')
  updateExperience(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.profilesService.updateExperience(id, userId, dto);
  }

  @Delete('experiences/:id')
  deleteExperience(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.profilesService.deleteExperience(id, userId);
  }
}
