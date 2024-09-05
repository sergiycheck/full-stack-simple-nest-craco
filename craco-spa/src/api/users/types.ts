export type RegisterUserDto = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type LoginUserDto = Omit<RegisterUserDto, 'repeatPassword'>;

export type LogoutUserDto = {
  id: number;
};

export type GetUserQuery = {
  id?: number;
  email?: string;
};

export interface UserLoginResponse {
  user: UserResponse;
  authInfo: { accessToken: string };
}

export interface UserResponse {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMessageResponse {
  message: string;
}

export type JwtPayload = {
  email: string;
  iat: number;
  exp: number;
};
