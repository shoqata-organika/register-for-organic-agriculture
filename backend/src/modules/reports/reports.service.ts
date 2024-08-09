import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly configService: ConfigService) {}

  getAdminEmbedUrl() {
    const payload = {
      resource: { dashboard: 1 },
      params: {
        language: null,
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    const token = jwt.sign(
      payload,
      this.configService.get('METABASE_SECRET_KEY'),
    );

    return (
      this.configService.get('METABASE_SITE_URL') +
      '/embed/dashboard/' +
      token +
      '#bordered=false&titled=false'
    );
  }

  getMemberEmbedUrl(user: User) {
    const payload = {
      resource: { dashboard: 3 },
      params: {
        member_id: user.member_id,
      },
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    const token = jwt.sign(
      payload,
      this.configService.get('METABASE_SECRET_KEY'),
    );

    return (
      this.configService.get('METABASE_SITE_URL') +
      '/embed/dashboard/' +
      token +
      '#bordered=false&titled=false'
    );
  }
}
