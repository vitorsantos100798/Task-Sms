export type ListCategoryQuery = {
  segmentId: number;
};

export type ListSubcategoryQuery = {
  categoryId: number;
  subcategoryId?: number;
  description?: string;
};

export type Category = {
  BACKGROUND_COLOR_HEX?: string;
  CREATEDAT?: string;
  DELETEDAT?: string;
  DESCRIPTION?: string;
  ID: number;
  IS_ACTIVE: number;
  UPDATEDAT?: string;
  URL_IMAGE_BACKGROUND_LEFT?: string;
  URL_IMAGE_BACKGROUND_RIGHT?: string;
  URL_IMAGE_SHORTCUT?: string;
};
export type Subcategory = {
  DESCRIPTION: string;
  ID: number;
  backgrounds: SubcategoryBackgrounds[];
  BACKGROUND_COLOR_HEX?: string;
  CREATEDAT?: string;
  DELETEDAT?: string;
  ID_SUBCATEGORY?: number;
  IS_ACTIVE?: number;
  UPDATEDAT?: string;
  URL_IMAGE_BACKGROUND_LEFT?: string;
  URL_IMAGE_BACKGROUND_RIGHT?: string;
  URL_IMAGE_SHORTCUT?: string;
};

export type SubcategoryFilter = {
  CREATEDAT?: string;
  DELETEDAT?: string;
  DESCRIPTION: string;
  ID: number;
  IS_ACTIVE: number;
  UPDATEDAT?: string;
};

export type SubcategoryBackgrounds = {
  COPY_BOOST?: unknown;
  COPY_SMS?: unknown;
  COPY_SOCIAL_NETWORKS?: unknown;
  COPY_WHATSAPP?: unknown;
  DESCRIPTION_SUBCATEGORY?: string;
  FAST_MODELS?: number;
  ID_SUBCATEGORY?: number;
  companyId?: number;
  createdAt?: string;
  deletedAt?: string;
  formatId?: number;
  id?: number;
  imageURL?: string;
  name?: string;
  occasionId?: number;
  segmentId?: number;
  tags?: unknown;
  thumbnail?: string;
  updatedAt?: string;
  productQuantity?: number;
  designURL: string;
  video_composition?: unknown;
  video_template_id?: unknown;
};
export interface FastModels {
  createdAt?: string;
  deletedAt?: string;
  description: string;
  id: number;
  is_active: number;
  updatedAt?: string;
}

export interface ArtsWithPrice {
  [key: number]: {
    price: string;
    url?: string;
    design?: string;
    preview?: string;
  };
}
