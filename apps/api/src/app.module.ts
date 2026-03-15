import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ListingsModule } from './modules/listings/listings.module';
import { CommunitiesModule } from './modules/groups/groups.module';
import { ForumModule } from './modules/forum/forum.module';
import { ChatModule } from './modules/chat/chat.module';
import { BadgesModule } from './modules/badges/badges.module';
import { MediaModule } from './modules/media/media.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    ThrottlerModule.forRoot({
      ttl: 60000,
      limit: 10,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ListingsModule,
    CommunitiesModule,
    ForumModule,
    ChatModule,
    BadgesModule,
    MediaModule,
    ModerationModule,
  ],
})
export class AppModule { }
