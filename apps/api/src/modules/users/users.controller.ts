import { Controller, Get, Param, UseGuards, Put, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get('search')
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'skills', required: false, type: [String] })
  @ApiQuery({ name: 'minPoints', required: false, type: Number })
  searchUsers(
    @Query('q') q?: string,
    @Query('skills') skills?: string | string[],
    @Query('minPoints') minPoints?: string,
  ) {
    const parsedSkills = typeof skills === 'string' ? skills.split(',') : skills;
    return this.usersService.searchUsers({
      q,
      skills: parsedSkills,
      minPoints: minPoints ? parseInt(minPoints) : undefined,
    });
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
