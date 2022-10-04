export interface Occasion {
  id: number;
  name: string;
  formatId: number;
  segmentId: number;
}

export type ListOccasionQuery = {
  formatId: number;
  segmentId: number;
};
