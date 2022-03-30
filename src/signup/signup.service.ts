import { HttpService, Injectable, HttpException, Render, BadRequestException } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { GlobalController } from '../global/global.controller';
import * as fs from 'fs';
@Injectable()
export class SignupService {
    constructor(
        private http: HttpService,
        private GlobalController: GlobalController
    ) {}
    
    async signup(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('signup params =>',params)

        var headersRequest = {
            'Content-Type': 'application/json', 
            'appId': process.env.APPID
        };
        var bodyEncrypt = await this.GlobalController.encryptObjectRsa(params);
        bodyEncrypt = await this.GlobalController.encryptObjectAes(bodyEncrypt)
        console.log('bodyEncrypt =>', JSON.stringify(bodyEncrypt))
        console.log('params =>', JSON.stringify(params))

        return this.http.post(process.env.API_HOST + '/register', params, { headers: headersRequest })
        .pipe(map((res) => {            
            return res.data;
        })).toPromise();
    }




}
