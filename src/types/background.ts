export type ListBackgroundQuery = {
  page: number;
  occasions?: number;
  formats: number;
  segments: number;
};

export interface Background {
  id: number;
  companyId?: any;
  segmentId: number;
  occasionId: number;
  formatId: number;
  name: string;
  imageURL: string;
  thumbnail: string;
  tags?: any;
}
