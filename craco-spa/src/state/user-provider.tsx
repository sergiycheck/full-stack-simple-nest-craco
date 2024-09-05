import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { UserLoginResponse, UserResponse } from '@/api/users/types'; // Assuming your types are stored in types.ts

interface UserContextProps {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  setAccessToken: (accessToken: string) => void;
  accessToken: string | null;
  login: (data: UserLoginResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useCallback((data: UserLoginResponse) => {
    setUser(data.user);
    setAccessToken(data.authInfo.accessToken);
    localStorage.setItem('accessToken', data.authInfo.accessToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  }, []);

  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider
      value={{ user, setUser, setAccessToken, accessToken, login, logout, setLoading, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
