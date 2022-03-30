import { Controller,  Get, Res, HttpStatus, Post, Body, Put, UploadedFile, UploadedFiles, Delete, Render, Param, Request, UseInterceptors } from '@nestjs/common';
import { LinkService } from './link.service';
import { GlobalController } from '../global/global.controller';
import {Response} from "express";
import { EditLinkDTO } from './dto/edit-link.dto';
const langId = require("../../resources/lang/id.json");
const langEn = require("../../resources/lang/en.json");

@Controller('link')
export class LinkController {
    constructor(
        private readonly LinkService: LinkService,
        private readonly GlobalController: GlobalController
    ) { }    
    @Get('new/:pageId')
    @Render('page/editlink')
    async addLinkGet(@Param('pageId') pageId, @Request() req){
        var language = ''; 
        if(req.cookies.language == 'id') { language = langId.editLink
        }else { language = langId.editLink 
        }
        return { 
            headingLink: process.env.HOST+'/page/edit/'+pageId, 
            headingTitle: 'Edit Link',
            language: language
        };
    }
    
    @Post('new/:pageId')
    async addNewLink(@Body() editLinkDTO: EditLinkDTO,  @Param('pageId') pageId, @Res() res: Response, @Request() req) {
        var body = JSON.parse(JSON.stringify(editLinkDTO));
        delete body.submit;
        // console.log('body link =>',body);
        var p = {url: 'link', body: body, deviceId: ''}
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
        var r = await this.GlobalController.postData(p)
        var gr = JSON.parse(JSON.stringify(r))
        console.log('addLink =>',gr)
        if(gr.responseCode == 200) {
            res.redirect(process.env.HOST+'/page/edit/'+pageId);
        }else{
            var language = ''; 
            if(req.cookies.language == 'id') { language = langId.editLink
            }else { language = langId.editLink 
            }
            return res.render('page/editlink', { 
                headingLink: process.env.HOST+'/page/edit/'+pageId, 
                headingTitle: 'Edit Link',
                language: language,
                res: gr
            });
        }
    }

    @Get('edit/:linkId/:pageId')
    @Render('page/editlink')
    async EditLink(@Param('linkId') linkId, @Param('pageId') pageId, @Request() req){
        try {
            var data=[];
            var p = {url: 'link?id='+linkId, deviceId: ''}
            if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }        
            var r = await this.GlobalController.getData(p)
            var gmlbi = JSON.parse(JSON.stringify(r)); // get merchant link by id
            console.log('gmlbi =>',gmlbi)
            if(gmlbi.responseCode == 200) {
                data=gmlbi.data[0];
            }
            var language = ''; 
            if(req.cookies.language == 'id') { language = langId.editLink
            }else { language = langId.editLink 
            }
            console.log('language =>',language)
            return { 
                headingLink: process.env.HOST+'/page/edit/'+pageId, 
                headingTitle: 'Edit Link',
                data: data,
                language: language
            };
        } catch (error) {
            console.log('error EditLink =>',error);

        }

    }
    @Post('edit/:linkId/:pageId')
    async editLinkPost(@Param('linkId') linkId, @Param('pageId') pageId, @Body() editLinkDTO: EditLinkDTO,  @Res() res: Response, @Request() req) {
        try {
            var body = JSON.parse(JSON.stringify(editLinkDTO));
            delete body.submit;
            body.linkId = linkId;
            var bodyEncrypt = await this.GlobalController.encryptObjectRsa(body);
            bodyEncrypt = await this.GlobalController.encryptObjectAes(bodyEncrypt)
    
            var p = {url: 'link', body: bodyEncrypt, deviceId: ''}
            if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
            var r = await this.GlobalController.postData(p)
            var pl = JSON.parse(JSON.stringify(r));
            console.log('editLinkPost =>',pl);
            if(pl.responseCode == 200) {
                res.redirect(process.env.HOST+'/page/edit/'+pageId);    
            }else{
                var data=[];
                p.url = 'link?id='+linkId;
                var r = await this.GlobalController.getData(p)
                var gmlbi = JSON.parse(JSON.stringify(r)); // get merchant link by id
                console.log('gmlbi =>',gmlbi)
                if(gmlbi.responseCode == 200) {
                    data=gmlbi.data[0];
                }
                var language = ''; 
                if(req.cookies.language == 'id') { language = langId.editLink
                }else { language = langId.editLink 
                }
                console.log('language =>',language)
                return res.render('page/editlink', { 
                    headingLink: process.env.HOST+'/page/edit/'+pageId, 
                    headingTitle: 'Edit Link',
                    data: data,
                    language: language,
                    res: pl
                });
    
            }
                
        } catch (error) {
            console.log('editLinkPost error =>',error);        
            res.redirect(process.env.HOST+'/page/edit/'+pageId);
            
        }
    }
    
    @Get('delete/:linkId/:pageId')
    async DeleteLink(@Param('linkId') linkId, @Param('pageId') pageId, @Res() res: Response, @Request() req){
        var p = {url: 'link', fieldId: 'linkId', fieldValue: linkId, deviceId: '' }
        if(req.cookies.deviceId) { p.deviceId=req.cookies.deviceId }
        var r = await this.GlobalController.delData(p)
        console.log('deleteLink =>',r);
        res.redirect(process.env.HOST+'/page/edit/'+pageId);
    }    
}
