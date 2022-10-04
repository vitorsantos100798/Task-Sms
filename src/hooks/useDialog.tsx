import { useContext } from 'react';

import { DialogContext, DialogContextData } from '../contexts/Dialog';

export function useDialog(): DialogContextData {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within an DialogProvider');
  }

  return context;
}
