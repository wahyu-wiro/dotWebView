import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { OtpModule } from './otp/otp.module';
import { AccountModule } from './account/account.module';
import { SettingModule } from './setting/setting.module';
import { SignupModule } from './signup/signup.module';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { GlobalModule } from './global/global.module';
import { GlobalService } from './global/global.service';
import { GlobalController } from './global/global.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  // imports: [
  //   MongooseModule.forRoot('mongodb://localhost/customer-app', { useNewUrlParser: true })
  // ],
  imports: [AuthModule, UsersModule, ProfileModule, HttpModule, OtpModule, AccountModule, SettingModule, SignupModule, ConfigModule.forRoot(), CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: process.env.PORT_REDIS
  }), LoginModule, GlobalModule ],
  controllers: [AppController],
  providers: [AppService, GlobalService, GlobalController],
})
export class AppModule {}
