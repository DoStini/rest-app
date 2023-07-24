import { CategoryType } from "./ProductTypes";
import { OrderType, TableType } from "./TableTypes";

export interface CustomFetcherResponse<T> {
  status: number;
  data: T;
}

type SwrBase<T> = {
  isLoading: boolean;
  error: any;
  data: T | undefined;
  mutate: (data?: T, shouldRevalidate?: boolean) => Promise<T | undefined>;
};

export type FetcherOrdersType = CustomFetcherResponse<TableType[]>;
export type SwrOrdersType = SwrBase<FetcherOrdersType>;

export type FetcherOrderType = CustomFetcherResponse<OrderType>;
export type SwrOrderType = SwrBase<FetcherOrderType>;

export type FetcherCategoryPageType = CustomFetcherResponse<{
  categories: CategoryType[];
  order: OrderType;
}>;
export type SwrCategoryPageType = SwrBase<FetcherCategoryPageType>;
