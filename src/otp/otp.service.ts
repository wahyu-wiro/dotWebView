import { HttpService, Injectable, HttpException, Render } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { GlobalController } from '../global/global.controller';
import * as fs from 'fs';

@Injectable()
export class OtpService {
    constructor(
        private http: HttpService,
        private GlobalController: GlobalController        
    ) {}
    async otpPut(params: any): Promise < Observable < AxiosResponse < any >>> {
        if(params.filter=='') {params.filter='null'}
        var p = JSON.parse(JSON.stringify(params))
        var headersRequest = {
            'Content-Type': 'application/json', 
            'appId': process.env.APPID,
            'deviceId': params.deviceId

        };
        console.log('params otpPut =>',params)
        return this.http.post(process.env.API_HOST + '/login', params, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }
    async otpUpdate(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('otpUpdate params =>',params)
        //handling OTP already used, boz already login
        // params.otpCode = params.txt1+params.txt2+params.txt3+params.txt4+params.txt5+params.txt6
        // params.phoneCode = '+62';
        // console.log('params =>',params);
        // var p = {
        //     phoneCode: params.phoneCode,
        //     phone: params.phone,
        //     deviceId: params.deviceId,
        //     otpCode: params.otpCode,
        //     status: '1',
        //     key: {
        //         appId: process.env.APPID,
        //         deviceId: params.deviceId,
        //         appSignature: process.env.APPSIGNATURE
        //     }
        // }
        var p = JSON.parse(JSON.stringify(params))
        console.log('otpUpdate p =>',p)
        var bodyEncrypt = await this.GlobalController.encryptObjectRsa(p);
        bodyEncrypt = await this.GlobalController.encryptObjectAes(bodyEncrypt)
        console.log('otpUpdate bodyEncrypt =>',bodyEncrypt)

        var headersRequest = {
            'Content-Type': 'application/json', 
            'appId': process.env.APPID,
            'deviceId': params.deviceId,
            'appSignature': process.env.APPSIGNATURE
            // 'appId': await this.GlobalController.encryptAes(process.env.APPID),
            // 'deviceId': await this.GlobalController.encryptAes(params.deviceId),
            // 'appSignature': await this.GlobalController.encryptAes(process.env.APPSIGNATURE)

        };
        return this.http.put(process.env.API_HOST + '/otpUpdate', bodyEncrypt, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }    
    async otpPost(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('params =>',params);
        // var p = {
        //     // phoneCode: params.phoneCode,
        //     phoneCode: '+62',
        //     phone: params.phone,
        //     oldPhoneCode: params.oldPhoneCode,
        //     oldPhone: params.oldPhone,
        //     deviceId: params.deviceId,
        //     key: {
        //         appId: process.env.APPID,
        //         deviceId: params.deviceId,
        //         appSignature: process.env.APPSIGNATURE
        //     }
        // }

        var p = JSON.parse(JSON.stringify(params))
        if(params.oldPhoneCode) { 
            p.oldPhoneCode = params.oldPhoneCode 
        }else{
            p.oldPhoneCode = 'null'
        }
        if(params.oldPhone) { 
            p.oldPhone = params.oldPhone 
        }else {
            p.oldPhone = 'null'
        }

        var bodyEncrypt = await this.GlobalController.encryptObjectRsa(p);
        bodyEncrypt = await this.GlobalController.encryptObjectAes(bodyEncrypt)

        var headersRequest = {
            'Content-Type': 'application/json', 
            'appId': process.env.APPID,
            'deviceId': params.deviceId,
            'appSignature': process.env.APPSIGNATURE

        };
        return this.http.post(process.env.API_HOST + '/login', bodyEncrypt, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }    
    async getAccount(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('getAccount params =>',params);
        var p = { 'phoneCode': params.phoneCode, 'phone': params.phone }
        var headersRequest = {
            'Content-Type': 'application/json', 
            'appSignature': process.env.APPSIGNATURE,
            'param': JSON.stringify(p)

        };

        return this.http.get(process.env.API_HOST + '/account', { headers: headersRequest })

        // return this.http.ge(process.env.API_HOST + '/otp', p, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }
    async logout(params: any): Promise < Observable < AxiosResponse < any >>> { // di pakai untuk force logout (already login)
        var headersRequest = {
            'token': params.token
        };
  
        return this.http.post(process.env.API_HOST + '/logout', {}, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }
  
}
