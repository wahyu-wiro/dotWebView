import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { SignupService } from './signup.service';
import { SignupController } from './signup.controller';
import { GlobalService } from '../global/global.service';
import { GlobalController } from '../global/global.controller';
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
  providers: [SignupService,  GlobalService, GlobalController],
  controllers: [SignupController],
  exports: [SignupService]

})
export class SignupModule {}
