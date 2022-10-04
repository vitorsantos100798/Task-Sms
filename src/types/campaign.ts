export type Campaign = {
  id: number;
  name: string;
  thumbnailURL: string;
  start_date: string;
  end_date: string;
  hash: string;
  arts: Array<{
    id: number;
    thumbnailURL: string;
  }>;
};

export type CreateCampaignData = {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
};
export type EditCampaignData = {
  name?: string;
  campaignId?: number;
};
