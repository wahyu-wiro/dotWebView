import { Controller, Get, Post, Request, Res, Render, Session, Body, CACHE_MANAGER, Inject, Req, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { json, Response } from 'express';
import { Cache } from 'cache-manager';
import { GlobalController } from '../global/global.controller';
const langId = require("../../resources/lang/id.json");
const langEn = require("../../resources/lang/en.json");
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
@Controller('account')
export class AccountController {
    constructor(
        private readonly AccountService: AccountService,
        private readonly GlobalController: GlobalController,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @Get()
    @Render('account/account')
    async account(@Res() res: Response, @Request() req ){
        var p: any = {}, gr: any = {}, gp: any = {};
        p.url = 'profile';
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        if(gr){
            p.param = JSON.stringify({email: gr.email})
        }
        var gp = await this.GlobalController.getData(p)
        var language = '';
        if(gp.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(gp.data) {
                if(gp.data.language == 'id'){ language = langId.account
                }else{ language = langEn.account
                }
            }
        }
        console.log('profile =>',gp.data)
        // console.log('language =>',language)
        return { 
            headingLink: process.env.HOST, 
            headingTitle: 'Account',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            data: gp.data,
            language: language
        };
    }
    @Get('myaccount')
    @Render('account/myAccount')
    async myAccount(@Request() req,@Res() res: Response){
        var p: any = {}, gr: any = {}, gp: any = {};
        p.url = 'profile';
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }

        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        if(gr){
            p.param = JSON.stringify({email: gr.email})
        }

        var gp = await this.GlobalController.getData(p)
        var language = '';
        if(gp.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(gp.data) {
                if(gp.data.language == 'id'){ language = langId.myAccount
                }else{ language = langEn.myAccount
                }
            }
        }
        console.log('language =>',language)
        return { 
            headingLink: process.env.HOST+'/account', 
            headingTitle: 'My Account',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            data: gp.data,
            language:language
        };        
    }

    @Post('myaccount')
    // @Render('account/myAccount')
    async updateProfile(@Body() body, @Request() req, @Res() res: Response) {
        var p: any = {}, gr: any = {}, gp: any = {}, pd: any = {};
        var body = JSON.parse(JSON.stringify(body));
        if(!body.deviceId) {
            if(req.cookies.deviceId) { body.deviceId=req.cookies.deviceId }
        }
        console.log('updateProfile body =>',body)

        // console.log('updateProfile body =>',body)
        p.url = 'profile';
        p.body = body;
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }

        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        console.log('getRedis sini =>',gr)

        pd = await this.GlobalController.putData(p)
        console.log('updateProfile =>',pd)


        if(body.phone) {
            body.filter='change_phone';
            var r = await this.GlobalController.getData(p)
            var profile = JSON.parse(JSON.stringify(r))
            var language='';

            if(pd.responseCode == 200) {
                if(profile.data) {
                    if(profile.data.language == 'id'){ language = langId.changeAccountOtp
                    }else{ language = langEn.changeAccountOtp
                    }
                }

                gr.phone = body.phone;
                await this.GlobalController.addRedis('key-'+p.deviceId, gr);
                res.redirect(process.env.HOST + '/account/myAccount')
            }else{
                if(profile.data) {
                    if(profile.data.language == 'id'){ language = langId.changePhone
                    }else{ language = langEn.changePhone
                    }
                }
                return res.render('account/changePhone',
                  { 
                    headingLink: process.env.HOST+'/account/myAccount', 
                    headingTitle: 'Change Mobile Number',
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,
                    profile: profile,
                    language: language,
                    data: body,
                    res: pd
                  },
                );                
            }
        }else if(body.email) {
            body.filter='change_email';
            var r = await this.GlobalController.getData(p)
            var profile = JSON.parse(JSON.stringify(r))
            console.log('profile =>',profile)
            var language='';

            if(pd.responseCode == 200) {
                if(profile.data) {
                    if(profile.data.language == 'id'){ language = langId.changeAccountOtp
                    }else{ language = langEn.changeAccountOtp
                    }
                }
                gr.email = body.email;
                await this.GlobalController.addRedis('key-'+p.deviceId, gr);
                res.redirect(process.env.HOST + '/account/myAccount')
            }else{
                if(profile.data) {
                    if(profile.data.language == 'id'){ language = langId.changePhone
                    }else{ language = langEn.changePhone
                    }
                }
                return res.render('account/changeEmail',
                  { 
                    headingLink: process.env.HOST+'/account/myAccount', 
                    headingTitle: 'Change Email',
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,
                    profile: profile,
                    language: language,
                    data: body,
                    res: pd
                  },
                );
            } 
        }else{
            if(pd.responseCode == 200) {
                res.redirect(process.env.HOST + '/account/myAccount')
            }else{
                return res.render('account/changeName',
                  { 
                    headingLink: process.env.HOST+'/account/myAccount', 
                    headingTitle: 'Change Name',
                    host: process.env.HOST,
                    host_no_basepath: process.env.HOST_NO_BASEPATH,
                    basepath: process.env.BASEPATH,
                    data: body,
                    res: pd
                  },
                );
            }
        }
    }
    
    @Post('changeLangauge')
    async changeLangauge(@Body() body, @Request() req, @Res() res: Response) {
        console.log('updateProfile body =>',body)
        var body = JSON.parse(JSON.stringify(body));
        body = JSON.parse(body.data);
        console.log('body =>', body);

        var p = {url: 'profile', body: body, deviceId: ''}
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
        var r = await this.GlobalController.putData(p)
        var pd = JSON.parse(JSON.stringify(r))
        console.log('changeLangauge =>',pd)
        if(pd.responseCode == 200) {
            res.cookie('language',body.language);
        }
        res.redirect(process.env.HOST + '/account/myAccount')
    }

    @Get('changeName')
    @Render('account/changeName')
    async changeNameAccount(@Request() req, @Res() res: Response){
        var p: any = {}, gr: any = {}, profile: any = {};
        p.url = 'profile';
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }

        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        if(gr){
            p.param = JSON.stringify({email: gr.email})
        }
        var profile = await this.GlobalController.getData(p)
        console.log('profile =>',profile)        
        var language = '';
        if(profile.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(profile.data) {
                if(profile.data.language == 'id'){ language = langId.changeName
                }else{ language = langEn.changeName
                }
            }
        }
        return { 
            headingLink: process.env.HOST+'/account/myAccount', 
            headingTitle: 'Change Name',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            profile: profile,
            language: language
        };
    }
    @Get('changePhone')
    @Render('account/changePhone')
    async changePhoneAccount(@Request() req, @Res() res: Response){
        var p: any = {}, gr: any = {}, profile: any = {};
        p.url = 'profile';
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }

        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        if(gr){
            p.param = JSON.stringify({email: gr.email})
        }
        var profile = await this.GlobalController.getData(p)
        console.log('profile =>',profile)        
        var language = '';
        if(profile.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(profile.data) {
                if(profile.data.language == 'id'){ language = langId.changeMobileNumber
                }else{ language = langEn.changeMobileNumber
                }
            }
        }
        // console.log('language =>',language)
        return { 
            headingLink: process.env.HOST+'/account/myAccount', 
            headingTitle: 'Change Mobile Number',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            profile: profile,
            language: language
        };
    }
    @Get('changeEmail')
    @Render('account/changeEmail')
    async changeEmailAccount(@Request() req,@Res() res: Response){
        var p: any = {}, gr: any = {}, profile: any = {};
        p.url = 'profile';
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }

        var key = 'key';
        if(p.deviceId) {key = key+'-'+p.deviceId}
        gr = await this.GlobalController.getRedis(key);
        if(gr){
            p.param = JSON.stringify({email: gr.email})
        }
        var profile = await this.GlobalController.getData(p)
        console.log('profile =>',profile)        

        // var profile = await this.getProfile(req.cookies.deviceId );
        var language = '';
        if(profile.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(profile.data) {
                if(profile.data.language == 'id'){ language = langId.changeEmail
                }else{ language = langEn.changeEmail
                }
            }
        }
        // console.log('language =>',language)
        return { 
            headingLink: process.env.HOST+'/account/myAccount', 
            headingTitle: 'Change Email',
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            profile: profile,
            language: language
        };
    }

    // async getProfile(deviceId=''){
    //     var p = {url: 'profile', deviceId: deviceId}
    //     var profile = await this.AccountService.getProfile(p);
    //     // await this.cacheManager.set('profile', profile);
    //     return profile;
    // }

}
