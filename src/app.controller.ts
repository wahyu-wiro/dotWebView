// src/app.controller.ts
import { Controller, Get, Post, Request, Res, Render, UseGuards, UseFilters, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Response } from 'express';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import { get } from 'mongoose';
import { GlobalController } from './global/global.controller';
// import * as en from './resources/lang/id.json'; // this ts file should still be imported fine
const lang = require("../resources/lang/id.json");
@Controller()
@UseFilters(AuthExceptionFilter)

export class AppController {
  // fakeValue = 'my name is name';
  constructor(
    private readonly AppService: AppService,
    private readonly GlobalController: GlobalController,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  
  @Get('/')
  // @Render('login/login')
  async loginPage(@Res() res: Response, @Request() req ) {
    // console.log('lang =>',lang.signin)
    console.log('loginPage deviceId =>',req.cookies.deviceIdn)
    var key = await this.GlobalController.getRedis('key-'+req.cookies.deviceId);
    console.log('getRedis =>',key)
    if(key){
      res.redirect(process.env.HOST + '/account');
    }else{
      return res.render('login/login', {
        host: process.env.HOST,
        host_no_basepath: process.env.HOST_NO_BASEPATH,
        basepath: process.env.BASEPATH,
      });
    }
  }

  // index(@Request() req): { message: string } {
  //   return { message: req.flash('loginError') };
  // }

  // @UseGuards(LoginGuard)
  // @Post('/login')
  // login(@Res() res: Response) {
  //   res.redirect('/seo');
  // }

  @UseGuards(AuthenticatedGuard)
  @Get('/home')
  @Render('home')
  getHome(@Request() req) {
    console.log('req =>',req)
    return { user: req.user };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile-default')
  @Render('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @Get('/logout')
  async logout(@Request() req, @Res() res: Response) {
    
    var key = await this.GlobalController.getRedis('key-'+req.cookies.deviceId)
    console.log('key=>',key)
    var ll = await this.AppService.logout(key);
    console.log('logout =>',ll)
    await this.GlobalController.delRedis('key-'+req.cookies.deviceId)
    await this.cacheManager.del('key'); // nanti dihapus, sudah tidak dipakai
    req.logout();
    res.redirect(process.env.HOST);

  }

}