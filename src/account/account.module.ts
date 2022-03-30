import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import * as redisStore from 'cache-manager-redis-store';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';

@Module({
  imports: [HttpModule, CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: process.env.PORT_REDIS
  })],
  providers: [AccountService, GlobalService, GlobalController],
  controllers: [AccountController]
})
export class AccountModule {}
