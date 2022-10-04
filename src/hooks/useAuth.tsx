import { useContext } from 'react';

import { AuthContext, AuthContextData } from '../contexts/Auth';

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
