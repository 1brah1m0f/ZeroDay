import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto, GetListingsDto, UpdateApplicationStatusDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('listings')
@ApiBearerAuth()
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) { }

  @Get()
  findAll(@Query() query: GetListingsDto) {
    return this.listingsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateListingDto) {
    return this.listingsService.create(userId, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.listingsService.delete(id, userId);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  myListings(@CurrentUser('id') userId: string) {
    return this.listingsService.findByUser(userId);
  }

  // --- Applications ---
  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  apply(@Param('id') listingId: string, @CurrentUser('id') userId: string) {
    return this.listingsService.applyToListing(listingId, userId);
  }

  @Get('applications/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  myApplications(@CurrentUser('id') userId: string) {
    return this.listingsService.getMyApplications(userId);
  }

  @Get('applications/received')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  receivedApplications(@CurrentUser('id') userId: string) {
    return this.listingsService.getReceivedApplications(userId);
  }

  @Put('applications/:appId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateApplicationStatus(
    @Param('appId') appId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.listingsService.updateApplicationStatus(appId, userId, dto.status);
  }

  @Delete('applications/:appId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteApplication(
    @Param('appId') appId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.listingsService.deleteApplication(appId, userId);
  }

  // --- Saved Listings ---
  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  toggleSave(@Param('id') listingId: string, @CurrentUser('id') userId: string) {
    return this.listingsService.toggleSavedListing(listingId, userId);
  }

  @Get('saved/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mySavedListings(@CurrentUser('id') userId: string) {
    return this.listingsService.getSavedListings(userId);
  }
}
