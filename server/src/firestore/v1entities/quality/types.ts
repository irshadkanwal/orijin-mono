import math from 'mathjs';
import { ObjectIdUser } from '../utis/types';

export type DescriptorContainer = {
  name: string;
  intensity: number;
  positive: boolean;
};
export type DescriptorSummaryContainer = {
  count: number;
  name: string;
};

export type ScoreContainer = {
  value: number;
  variance?: number;
  standardDeviation?: number | math.Complex;
};

export type SummaryItemContainer = {
  noScore?: boolean;
  label?: string;
  variableType?: string;
  score?: ScoreContainer;
  quality?: ScoreContainer;
  intensity?: ScoreContainer;
  notes?: string[];
  descriptors?: DescriptorSummaryContainer[];
};

export type SummaryContainer = {
  notes?: string[];
  evaluators?: ObjectIdUser[];
  allDescriptors?: DescriptorSummaryContainer[];
  itemSummary?: SummaryItemContainer[];
};

export type RadarChartDataset = {
  label: string;
  data: number[];
};
export type RadarChartData = {
  labels: string[];
  dataSets: RadarChartDataset[];
};

export type RadarChartResponse = {
  url: string;
  storagePath: string;
  publicUrl: string;
};

export type CreateChartRequest = {
  id: {
    refcollection: string;
    id: string;
  };
  organisation: string;
  workspace: string;
  chartData: RadarChartData;
};
