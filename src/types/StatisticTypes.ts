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

export type EmployeeStatistics = {
  monetary: {
    name: string;
    value: number;
  }[];
  biggest: {
    name: string;
    value: number;
  }[];
  quantity: {
    name: string;
    value: number;
  }[];
};
