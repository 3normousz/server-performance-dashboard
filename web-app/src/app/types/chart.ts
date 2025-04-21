export type ChartDataPoint = {
  timestamp: string;
  value: number;
  [key: string]: number | string | undefined;
};

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};