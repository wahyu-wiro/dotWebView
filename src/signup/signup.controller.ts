import { Controller, Get, Post, Request, Res, Render, UseGuards, UseFilters, Body, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { SignupService } from './signup.service';
import { SignupDTO } from './dto/signup.dto';
import { GlobalController } from '../global/global.controller';
@Controller('signup')
export class SignupController {
  constructor(
    private readonly GlobalController: GlobalController,
    private readonly SignupService: SignupService
  ) {}

  @Get()
  @Render('signup/signup')
  async signup(@Request() req,@Res() res: Response) {
    return { 
      host: process.env.HOST,
      host_no_basepath: process.env.HOST_NO_BASEPATH,
      basepath: process.env.BASEPATH
    };
  }
  
  @Post()
  async signupPost(@Body() SignupDTO: SignupDTO, @Request() req, @Res() res: Response) {
    var body = JSON.parse(JSON.stringify(SignupDTO));
    delete body.submit
    if(req.cookies.deviceId) { 
      body.deviceId=req.cookies.deviceId 
    }else{
      if(body.deviceId){ // set coocki
        res.cookie('deviceId',body.deviceId);
      }
    }
    // body.answer = 'yes'
    if(body.categoryId == '') {
      delete body.categoryId
    }
    if(body.subCategoryId == '') {
      delete body.subCategoryId
    }
    console.log('body =>',body)

    var s = await this.SignupService.signup(body);
    var signup = JSON.parse(JSON.stringify(s));
    console.log('signup =>',signup)
    if(signup.responseCode == 200) {
      
      var myKey = {
          phone: body.phone,
          email: body.email,
          fullname: body.fullname,
      }
      await this.GlobalController.addRedis('key-'+body.deviceId, myKey);
      var param = JSON.stringify({email: body.email})
      var p = {url: 'profile', deviceId: '', param: param}
      if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
      var r = await this.GlobalController.getData(p)        
      var gp = JSON.parse(JSON.stringify(r))
      if(gp.responseCode == 200) {
          if(gp.data) {
              if(gp.data.language){ res.cookie('language',gp.data.language);
              }else{ res.cookie('language','en');
              }
          }
      }
      res.redirect(process.env.HOST + '/account');

      
      // return res.render('otp',
      //   { 
      //     data: body,
      //     host: process.env.HOST,
      //     host_no_basepath: process.env.HOST_NO_BASEPATH,
      //     basepath: process.env.BASEPATH,
      //     back: {text: 'Back to Sign Up', link: process.env.HOST + '/signup'}
      //   },
      // );
    }else if(signup.responseCode == 458) { // Data registration is already exist
      body.answer = 'yes'
      s = await this.SignupService.signup(body);
      signup = JSON.parse(JSON.stringify(s));
      console.log('signup is already exist =>',signup)
      if(signup.responseCode == 200) {
        body.filter = 'use_exist'
        var phone = body.phone;
        var l = phone.length
        var sub = l - 3
        body.maskPhone = '...'+phone.substring(sub);
        console.log('body use_exist =>',body)
        if(signup.data){ body.cityId =signup.data.cityId; }
        return res.render('otp',
          { 
            data: body,
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            back: {text: 'Back to Sign Up', link: process.env.HOST + '/signup'}
          },
        );
      }else{
    
        return res.render('signup/signup',
        { 
          res: signup,
          data: body,
          host: process.env.HOST,
          host_no_basepath: process.env.HOST_NO_BASEPATH,
          basepath: process.env.BASEPATH,
          failed: 'failed'
        },
      );
      }
    }else{
      return res.render('signup/signup',
        { 
          res: signup,
          data: body,
          host: process.env.HOST,
          host_no_basepath: process.env.HOST_NO_BASEPATH,
          basepath: process.env.BASEPATH,
          failed: 'failed'
        },
      );
    }

    // return signup; 
  }

}
