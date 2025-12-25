export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResult {
  userId: string;
  email: string;
  role: string;
}
