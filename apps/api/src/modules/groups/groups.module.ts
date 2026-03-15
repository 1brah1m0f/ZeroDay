import { Module } from '@nestjs/common';
import { CommunitiesController } from './groups.controller';
import { CommunitiesService } from './groups.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}
