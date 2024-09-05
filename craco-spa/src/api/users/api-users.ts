import { apiCall } from '../api-call';
import {
  GetUserQuery,
  LoginUserDto,
  LogoutUserDto,
  RegisterUserDto,
  UserLoginResponse,
  UserMessageResponse,
  UserResponse
} from './types';

const apiUsers = {
  signUp(data: RegisterUserDto): Promise<UserLoginResponse> {
    return apiCall<UserLoginResponse>('/sign-up', 'POST', data);
  },

  signIn(data: LoginUserDto): Promise<UserLoginResponse> {
    return apiCall<UserLoginResponse>('/sign-in', 'POST', data);
  },

  signOut(data: LogoutUserDto, token: string): Promise<UserMessageResponse> {
    return apiCall<UserMessageResponse>('/sign-out', 'POST', data, token);
  },

  getUser(query: GetUserQuery, token: string): Promise<UserResponse> {
    const queryParams = new URLSearchParams();
    if (query.id) queryParams.append('id', query.id.toString());
    if (query.email) queryParams.append('email', query.email);

    return apiCall<UserResponse>(`?${queryParams.toString()}`, 'GET', undefined, token);
  },

  removeUser(data: LogoutUserDto, token: string): Promise<UserMessageResponse> {
    return apiCall<UserMessageResponse>('/remove', 'POST', data, token);
  }
};
export default apiUsers;
