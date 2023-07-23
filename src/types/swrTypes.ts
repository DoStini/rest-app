import { TableType } from "./TableTypes";

export type SwrOrdersType = {
  isLoading: boolean;
  data: { tables: TableType[] };
};
