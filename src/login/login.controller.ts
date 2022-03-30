import { Controller, Get, Post, Request, Res, Render, UseGuards, UseFilters, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import { loginDTO } from './dto/login.dto';
import { get } from 'mongoose';
import { GlobalController } from '../global/global.controller';

@Controller('login')
export class LoginController {
    constructor(
        private LoginService: LoginService,
        private GlobalController: GlobalController
    ) { }

    @Post()
    async loginPost(@Body() loginDTO: loginDTO, @Request() req, @Res() res: Response) {
        var body = JSON.parse(JSON.stringify(loginDTO));
        delete body.submit;
        if(body.deviceId){ // set coocki
            res.cookie('deviceId',body.deviceId);
        }
        // body.asyik='woyyyyyyy';
        console.log('body =>',body)
        var r = await this.LoginService.loginPost(body);
        var lp = JSON.parse(JSON.stringify(r));
        console.log('loginPost =>',lp)

        if(lp.responseCode == 200) {
            var phone = body.phone;
            var l = phone.length;
            var s = l-3;
            var e = phone.substr(s,3)
            body.filter='login';
            return res.render('otp',
              { 
                data: body,
                end: e,
                host: process.env.HOST,
                host_no_basepath: process.env.HOST_NO_BASEPATH,
                basepath: process.env.BASEPATH,
                back: {text: 'Back to Sign in', link: process.env.HOST}
              },
            );
        }else{
            return res.render('login/login',
                { 
                    res: lp,
                    data: body,
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,    
                    response: lp
                },
            );    
        }

    }

    @Get()
    @Render('login/login')
    async login(@Res() res: Response) {
        // res.redirect('/login')
        return {
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH
        }
    }
    @Post('switch')
    async switchLoginPost(@Body() loginDTO: loginDTO, @Request() req, @Res() res: Response) {
        console.log('otpResend =>',loginDTO)
        var body = JSON.parse(JSON.stringify(loginDTO));
        body = JSON.parse(body.data);
        console.log('body.data =>',body);

        if(body.deviceId){ // set coocki
            res.cookie('deviceId',body.deviceId);
        }
        if(body.phone) {
            if (body.phone.charAt(0) === "0") {
                body.phone = body.phone.substring(1);
            }
        }
        // body.asyik='woyyyyyyy';
        console.log('body =>',body)
        var r = await this.LoginService.loginPost(body);
        var lp = JSON.parse(JSON.stringify(r));
        console.log('loginPost =>',lp)

        if(lp.responseCode == 200) {
            var phone = body.phone;
            var l = phone.length;
            var s = l-3;
            var e = phone.substr(s,3)
            body.filter='login';
            return res.render('otp',
              { 
                data: body,
                end: e,
                host: process.env.HOST,
                host_no_basepath: process.env.HOST_NO_BASEPATH,
                basepath: process.env.BASEPATH,
                back: {text: 'Back to Sign in', link: process.env.HOST}
              },
            );
        }else{
            return res.render('login/login',
                { 
                    res: lp,
                    data: body,
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,    
                    response: lp
                },
            );    
        }

    }    

}
