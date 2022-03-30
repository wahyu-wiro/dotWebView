import { HttpService, Injectable, HttpException, Render } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { GlobalController } from '../global/global.controller';
import * as fs from 'fs';

@Injectable()
export class LoginService {
    constructor(
        private http: HttpService,
        private GlobalController: GlobalController
    ) {}
    async loginPost(params: any): Promise < Observable < AxiosResponse < any >>> {
        // loginDTO.appSignature = process.env.APPSIGNATURE;
        // console.log('loginPost params =>',params);
        var aes = process.env.AES_KEY_CLIENT+':'+process.env.AES_IV_CLIENT;
        var clientKey = fs.readFileSync('./publicKey.key', 'utf8');

        var headersRequest = {
            'Content-Type': 'application/json', 
            // 'appSignature': process.env.APPSIGNATURE
            // 'appSignature': await this.GlobalController.encryptAes(process.env.APPSIGNATURE),
            // 'aes': await this.GlobalController.encrypterRsa(aes),
            // 'clientKey': await this.GlobalController.encryptAes(clientKey)
        };
        return this.http.post(process.env.API_HOST + '/login?continue=localhost:3080&flowEntry=dot', params, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }
}
