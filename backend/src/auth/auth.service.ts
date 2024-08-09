import { Injectable } from '@nestjs/common';
import { MemberService } from 'src/modules/members/member.service';
import * as bcrypt from 'bcrypt';
import { IMember } from 'src/modules/members/member.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    return new Promise((resolve) => {
      if (user) {
        bcrypt.compare(pass, user.password, function (err, result) {
          if (result === true) {
            console.log('user', user);
            resolve(user);
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      member_id: user.member_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(data: IMember) {
    const member = await this.memberService.create(data);

    return member;
  }
}
