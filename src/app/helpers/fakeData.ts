import { Role } from '../enum/role';

export class FakeData {  
  static users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin',
      role: Role.Admin,
    },
    {
      id: 3,
      username: 'user',
      password: 'user',
      role: Role.User,
    },
  ]
}