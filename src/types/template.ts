export type ListTemplateQuery = {
  tags?: string;
  formats: number;
  productQuantity: number;
  video?: boolean;
};

export interface Template {
  id: number;
  companyId?: number;
  formatId: number;
  occasionId?: any;
  segmentId?: any;
  name: string;
  imageURL: string;
  designURL: string;
  productQuantity: number;
  tags: string;
  video_template_id?: number;
  video_composition?: string;
}
