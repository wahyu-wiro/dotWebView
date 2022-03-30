import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: process.env.PORT_REDIS
    }),    
  ],
  controllers: [SettingController],
  providers: [SettingService, GlobalService, GlobalController]
})
export class SettingModule {}
