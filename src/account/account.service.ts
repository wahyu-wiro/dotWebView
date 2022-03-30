import { HttpService, Injectable, HttpException, Render, BadRequestException } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AccountService {
    constructor(private http: HttpService) {}
    async getProfile(params: any): Promise < Observable < AxiosResponse < any >>> {
        var headersRequest = {
            'Content-Type': 'application/json', 
            'signature': params.signature,
            'token': params.token
        };
        return this.http.get(process.env.API_HOST + '/profile', { headers: headersRequest })
        .pipe(map((res) => {
            // if(res.data.responseCode != 200) {
            //     res.data.data = {
            //         fullname: 'Mr. Example',
            //         email: 'example99@gmail.com',
            //         phone: '0822-1231-1231'
            //     }
            // }
            return res.data;
        })).toPromise();
    }

    async updateProfile(params: any): Promise < Observable < AxiosResponse < any >>> {
        console.log('params =>',params);
        var headersRequest = {
            'Content-Type': 'application/json',
            'signature': params.signature,
            'token': params.token
        };

        return this.http.put(process.env.API_HOST + '/profile',params, { headers: headersRequest })
        .pipe(map((res) => {
            console.log('res.data ->',res.data)
            if(res.data.responseCode != 200) {
                // res.data = '';
            }
            return res.data;
        })).toPromise();
    }
}
