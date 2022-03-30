import { Controller, Get, Res, Render, CACHE_MANAGER, Inject, Request  } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Response } from "express";
import { Cache } from 'cache-manager';
import { GlobalController } from '../global/global.controller';
const langId = require("../../resources/lang/id.json");
const langEn = require("../../resources/lang/en.json");

@Controller('setting')
export class SettingController {
    constructor(
        private readonly SettingService: SettingService,
        private readonly GlobalController: GlobalController,
        @Inject(CACHE_MANAGER) private cacheManager: Cache        
    ) { }
    @Get()
    @Render('setting/setting')
    async setting(@Request() req, @Res() res: Response){
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
        console.log('getProfile =>',gp)
        var data = {};
        if(gp.responseCode == 401) {
            res.redirect(process.env.HOST);
        }else{
            if(gp.responseCode == 200) {
                data = gp.data
                var language = '';
                if(gp.data) {
                    if(gp.data.language == 'id'){ language = langId.settings
                    }else{ language = langEn.settings
                    }
                }
            }
            console.log('language =>',language)
        }
        return { 
            headingLink: process.env.HOST+'/account', 
            headingTitle: 'Settings', 
            changeLangaugeLink: process.env.HOST+"/account/changelangauge",
            host: process.env.HOST,
            host_no_basepath: process.env.HOST_NO_BASEPATH,
            basepath: process.env.BASEPATH,
            data: data,
            language: language
        };
    }


}
