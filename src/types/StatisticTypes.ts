export type Statistic = {
  name: string;
  value: string;
  preValue?: string;
  subValue?: string;
};

export type MainStatistics = Statistic[];

export type ProductStatistics = {
  total: number;
  products: {
    name: string;
    amount: number;
  }[];
  categories: {
    name: string;
    amount: number;
  }[];
};
