import { HttpService,  Injectable, HttpException } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { json } from 'express';
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GlobalService {
    constructor(
        private http: HttpService
    ) {}

    getRedis() {
        return 'getRedis service'
    }

    async getData(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('getData params =>',params)
        // var headersRequest = {
        //     'Content-Type': 'application/json', 
        //     'signature': params.key.signature,
        //     'deviceId': params.header.deviceId,
        //     'param':''
        // };
        var headersRequest = {
            'Content-Type': 'application/json', 
            'param':''
        };

        if(params.header.param) {headersRequest.param = params.header.param}
        return this.http.get(process.env.API_HOST + '/' + params.header.url, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }

    async postData(params: any): Promise < Observable < AxiosResponse < any >>> {
        try {
            var h = {
                'Content-Type': 'application/json', 
                'signature': params.key.signature,
                'token': params.key.token,
                'aes': 'aes',
                'clientKey': 'clientKey'
    
            };
            var headersRequest = JSON.parse(JSON.stringify(h));

            return this.http.post(process.env.API_HOST + '/' + params.data.url, params.data.body, { headers: headersRequest })
            .pipe(map((res) => {
                return res.data;
            })).toPromise();
        } catch (error) {
            console.log("error::", error);
           
        }

    }

    async putData(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('params =>',params)
        var headersRequest = {
            'Content-Type': 'application/json', 
            'signature': params.key.signature,
            'token': params.key.token
        };
        var headers = JSON.parse(JSON.stringify(headersRequest))
        var hkey =params.data.body.key;

        //console.log('params.data.key =>',params.data.key)
        if(hkey){
            if(hkey.appId) {
                headers.appId = hkey.appId
            }
            if(hkey.deviceId) {
                headers.deviceId = hkey.deviceId
            }
            if(hkey.appSignature) {
                headers.appSignature = hkey.appSignature
            }
        }

        console.log('putData header ->',headers)
        return this.http.put(process.env.API_HOST + '/' + params.data.url, params.data.body, { headers: headers })
        .pipe(map((res) => {
            // console.log('putData res=>',res.data.responseCode)
            return res.data;
        })).toPromise();
        
    }

    async delData(params: any): Promise < Observable < AxiosResponse < any >>> {
        var fieldId=params.data.fieldId;
        var headersRequest = {
            'Content-Type': 'application/json', 
            'signature': params.key.signature,
            'token': params.key.token,
            [fieldId]: params.data.fieldValue
        };
        return this.http.delete(process.env.API_HOST + '/' + params.data.url, { headers: headersRequest })
        .pipe(map((res) => {
            return res.data;
        })).toPromise();
    }   
}
