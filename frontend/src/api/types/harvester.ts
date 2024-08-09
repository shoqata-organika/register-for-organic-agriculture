import { Zone } from '@/api/types/zone';

export interface Harvester {
  id: number;
  first_name: string;
  last_name: string;
  code: string;
  address?: string | null;
  family_members?: number | null;
  zone_id?: string | null;
  external_id?: string | null;
  legal_status?: 'physical' | 'legal' | null;
  image?: string | File | null;
  contracted_file?: string | File | null;
}

export interface HarvesterView {
  id: number;
  first_name: string;
  last_name: string;
  code: string;
  address: string;
  family_members: number;
  zone: Zone;
  zone_id: number | string;
  external_id: string | null;
  legal_status: 'physical' | 'legal' | null;
  image: string | null;
  contract_file: string | null;
}
