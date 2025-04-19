export type ChartDataPoint = {
  date: string;
  value: number;
  device?: string;
  [key: string]: number | string | undefined;
};

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};