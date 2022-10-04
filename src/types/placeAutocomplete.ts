interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}

export type Prediction = {
  place_id: string;
  description: string;
  structured_formatting: StructuredFormatting;
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type Location = {
  lat: number;
  lng: number;
};

export type Northeast = {
  lat: number;
  lng: number;
};

export type Southwest = {
  lat: number;
  lng: number;
};

export type Viewport = {
  northeast: Northeast;
  southwest: Southwest;
};

export type Geometry = {
  location: Location;
  viewport: Viewport;
};

export type Place = {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
};
