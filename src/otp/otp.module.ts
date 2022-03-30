import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [HttpModule, CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: process.env.PORT_REDIS
  })],  
  providers: [OtpService, GlobalService, GlobalController],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}
