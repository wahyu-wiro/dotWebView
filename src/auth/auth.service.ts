import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // async validateUser(username, pass): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   console.log('validateUser =>',user)
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
  async validateUser(username, pass, phone): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log('validateUser =>',user)
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }  
}
