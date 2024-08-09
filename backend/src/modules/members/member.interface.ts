import { Member } from './member.entity';

export interface IMember extends Member {
  owner_first_name?: string;
  owner_last_name?: string;
  password: string;
  username: string;
}
