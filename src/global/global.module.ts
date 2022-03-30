import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { GlobalService } from './global.service';
import { GlobalController } from './global.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: process.env.PORT_REDIS
    })
  ],
  providers: [GlobalService],
  controllers: [GlobalController]
})
export class GlobalModule {}
