export interface CreateTireDto {
  uuid: string;
  brand: string;
  size: string;
  season: string;
  treadDepth: number;
  productionYear: number;
  imageUrl: string;
}

export interface TireStorageErrors {
  fetchAllTires: string | null;
  create: string | null;
  recycle: string | null;
}
