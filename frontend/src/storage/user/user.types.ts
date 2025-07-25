export interface CreateUserDto {
  name: string;
  imageUrl: string;
  isServiceProvider: boolean;
  city: string;
}

export interface UserStorageErrors {
  create: string | null;
}
