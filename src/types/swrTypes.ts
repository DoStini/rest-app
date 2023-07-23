import { OrderType, TableType } from "./TableTypes";

export interface CustomFetcherResponse<T> {
  status: number;
  data: T;
}

type SwrBase<T> = {
  isLoading: boolean;
  error: any;
  data: T | undefined;
};

export type FetcherOrdersType = CustomFetcherResponse<TableType[]>;
export type SwrOrdersType = SwrBase<FetcherOrdersType>;

export type FetcherOrderType = CustomFetcherResponse<OrderType>;
export type SwrOrderType = SwrBase<FetcherOrderType>;
