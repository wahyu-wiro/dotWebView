import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';
import * as redisStore from 'cache-manager-redis-store';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    HttpModule, 
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: process.env.PORT_REDIS
    }),
  ],
  providers: [LinkService, GlobalService, GlobalController],
  controllers: [LinkController]
})
export class LinkModule {}
