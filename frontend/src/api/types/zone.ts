export interface Zone {
  id: number;
  latitude: number | null;
  longitude: number | null;
  total_area: number;
  num_of_harvesters: number;
  name: string;
  code: string;
  file?: File | string | null;
}
