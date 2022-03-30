import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: any[];
  
  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        phone: '123',
        pet: { name: 'alfred', picId: 1 },
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        phone: '456',
        pet: { name: 'gopher', picId: 2 },
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
        phone: '789',
        pet: { name: 'jenny', picId: 3 },
      },
    ];
  }

  // async findOne(username: string): Promise<any> {
  //   return this.users.find(user => user.username === username);
  // }
  async findOne(username: string): Promise<any> {
    return this.users.find(user => user.phone === username);
  }

}
