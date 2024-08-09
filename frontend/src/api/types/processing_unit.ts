export interface ProcessingUnit {
  id?: number | null;
  name: string;
  total_area: number;
  latitude?: number;
  longitude?: number;
  ownership_status: 'owned' | 'rented';
  type_of_processing: string;
  contract_start_date?: Date | null;
  contract_end_date?: Date | null;
  file?: File | null;
}

export interface ProcessingUnitView {
  id: number;
  name: string;
  total_area: number;
  latitude: number | null;
  longitude: number | null;
  ownership_status: 'owned' | 'rented';
  type_of_processing: string;
  contract_start_date: Date;
  contract_end_date: Date;
  file: string | null;
}
