import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [HttpModule, CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: process.env.PORT_REDIS
  })],
  controllers: [LoginController],
  providers: [LoginService, GlobalService, GlobalController],
  exports: [LoginService],

})
export class LoginModule {}
