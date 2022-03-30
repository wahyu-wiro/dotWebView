import { HttpService, Injectable, HttpException, Render, BadRequestException } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}
  async logout(params: any): Promise < Observable < AxiosResponse < any >>> {
      var headersRequest = {
          'phone': params.phone,
          'email': params.email,
          'fullname': params.fullname,
      };

      return this.http.post(process.env.API_HOST + '/logout', {}, { headers: headersRequest })
      .pipe(map((res) => {
        // console.log('res =>',res)
          return res.data;
      })).toPromise();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
