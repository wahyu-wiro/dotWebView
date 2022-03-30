import { Controller, Get, Post, Request, Res, Render, UseGuards, UseFilters, Body, HttpStatus, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Response } from 'express';
import { OtpService } from './otp.service';
import { otpDTO } from './dto/otp.dto';
import { Cache } from 'cache-manager';
import { GlobalController } from '../global/global.controller';
const langId = require("../../resources/lang/id.json");
const langEn = require("../../resources/lang/en.json");
@Controller('otp')
export class OtpController {
    constructor(
        private OtpService: OtpService,
        private GlobalController: GlobalController,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }
    
    @Get()
    @Render('otp')
    async getOtp(){
        return { 
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            message: 'Hello world!' 
        };     
    }
    @Get('new')
    @Render('otp/otp-new')
    async getOtpNew(@Res() res: Response, @Request() req ){
        var p = {url: 'profile', deviceId: ''}
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
        var r = await this.GlobalController.getData(p)
        var gp = JSON.parse(JSON.stringify(r))
        var language = '';
        if(gp.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(gp.data) {
                if(gp.data.language == 'id'){ language = langId.changeAccountOtp
                }else{ language = langEn.changeAccountOtp
                }
            }
        }
        console.log('language =>',language)
        return { 
            headingLink: process.env.HOST+'/account', 
            headingTitle: 'Verify Mobile Number',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            language: language
        };

    }

    @Post()
    async otpPost(@Body() otpDTO: otpDTO, @Request() req, @Res() res: Response) {
        var body = JSON.parse(JSON.stringify(otpDTO));
        console.log('body otpPost =>',body)
        if(req.cookies.deviceId) { body.deviceId = req.cookies.deviceId; }        
        var result = await this.OtpService.otpPut(body); // tembak local untuk add redis

        var op = JSON.parse(JSON.stringify(result))
        console.log('otpPut =>',op)

        if(op.responseCode == 200) {
            if(body.filter == 'change_phone') {
                res.redirect(process.env.HOST + '/account/myaccount');
            }else if(body.filter == 'change_email') {
                res.redirect(process.env.HOST + '/account/myaccount');
            }else{
                var myKey = {
                    phone: op.data.phone,
                    email: op.data.email,
                    fullname: op.data.fullname,
                }
                await this.GlobalController.addRedis('key-'+body.deviceId, myKey);
                var param = JSON.stringify({email: op.data.email})
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
            }

        }else{
            return res.render('otp',
                { 
                    res: op,
                    data: otpDTO,
                    response: op,
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,
                },
            );
        }

    }
    @Post('/resend')
    async otpResend(@Body() otpDTO: otpDTO, @Request() req, @Res() res: Response) {
        console.log('otpResend =>',otpDTO)
        var body = JSON.parse(JSON.stringify(otpDTO));
        body = JSON.parse(body.data);
        console.log('body.data =>',body);
        var result = await this.OtpService.otpPost(body); // tembak local untuk add redis
        var op = JSON.parse(JSON.stringify(result))
        console.log('otpPost =>',op)

        return res.render('otp',
        { 
            res: op,
            data: body
        });    
        //res.redirect(process.env.HOST + '/otp');
    }
    
    
}
