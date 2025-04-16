export type ChartDataPoint = {
  date: string;
} & { [key: string]: number | string };

export type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};