export type NewArtType = { ProductToEdit?: number };

export type StateType = {
  NewArt: NewArtType;
};

export type ActionsType = {
  updateArtToEdit: (artId: number | undefined) => void;
};

export type ArtContextPropsType = StateType & ActionsType;

export type ArtProviderProps = {
  children: React.ReactNode;
};
