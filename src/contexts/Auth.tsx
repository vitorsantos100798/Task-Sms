import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import api from '../services/api';
import { signInService } from '../services/sessions';
import { SignInCredentials } from '../types/session';
import { User } from '../types/user';

type AuthProviderProps = {
  children: React.ReactNode;
};

export type AuthState = {
  token: string;
  refresh_token: string;
  user: User;
};

export type AuthContextData = {
  user: User;
  token: string;
  loading: boolean;
  changeUser(user: User): Promise<void>;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const [token, refresh_token, user] = await AsyncStorage.multiGet([
        '@datasales:token',
        '@datasales:refresh_token',
        '@datasales:user',
      ]);

      if (token[1] && refresh_token[1] && user[1]) {
        api.defaults.headers.common.Authorization = `${token[1]}`;

        const parsedUser = JSON.parse(user[1]);

        const now = new Date();
        const startingData = new Date(parsedUser.trialStartDate);
        const endingData = new Date(parsedUser.trialEndDate);

        const trialPeriodIsValid = parsedUser.trial && now >= startingData && now <= endingData;

        parsedUser.trialPeriodIsValid = trialPeriodIsValid;

        setData({
          token: token[1],
          refresh_token: refresh_token[1],
          user: parsedUser,
        });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await signInService({ email, password });

    const { token, refresh_token, user } = response;

    api.defaults.headers.common.authorization = `${token}`;

    const now = new Date();
    const startingData = new Date(user.trialStartDate);
    const endingData = new Date(user.trialEndDate);

    const trialPeriodIsValid = user.trial && now >= startingData && now <= endingData;

    user.trialPeriodIsValid = trialPeriodIsValid;

    await AsyncStorage.multiSet([
      ['@datasales:token', token],
      ['@datasales:refresh_token', refresh_token],
      ['@datasales:user', JSON.stringify(user)],
    ]);

    setData({ token, refresh_token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@datasales:token', '@datasales:refresh_token', '@datasales:user']);

    setData({} as AuthState);
  }, []);

  const changeUser = useCallback(async (user: User) => {
    await AsyncStorage.setItem('@datasales:user', JSON.stringify(user));
    setData(prev => ({ ...prev, user }));
  }, []);

  const authContextData = useMemo(() => {
    return {
      user: data.user,
      token: data.token,
      loading,
      signIn,
      signOut,
      changeUser,
    };
  }, [data.token, data.user, loading, signIn, signOut, changeUser]);

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
}
