import { ArtContextPropsType, ArtProviderProps, StateType } from '@project-types/art.context';
import React, { createContext } from 'react';

export const ArtContext = createContext<ArtContextPropsType | null>(null);

export default function ArtProvider({ children }: ArtProviderProps) {
  const [contextProps, setContextProps] = React.useState<StateType>({
    NewArt: { ProductToEdit: undefined },
  });
  const contextValues = React.useMemo<StateType>(() => contextProps, [contextProps]);

  const updateArtToEdit = (artId: number | undefined) => {
    setContextProps(lastContextProps => ({
      ...lastContextProps,
      NewArt: { ProductToEdit: artId },
    }));
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  return <ArtContext.Provider value={{ ...contextValues, updateArtToEdit }}>{children}</ArtContext.Provider>;
}
