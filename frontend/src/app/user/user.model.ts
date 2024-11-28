export interface UserModel {
  id: string;
  email: string;
  password?: string;
  userName?: string;
  company?: string;
  role?: string;
  activated: boolean;
  disabled: boolean;
  numberOfLogins?: number;
  token?: string;
}

export interface GetUserListResponse {
  nbTotalUsers: number;
  nbPages: number;
  data: UserModel[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isAuthSuccessful: boolean;
  errorMessage?: string;
  token?: string;
  userName?: string;
  company?: string;
}
