import { Decimal } from "@prisma/client/runtime/library";
import { ProductType } from "./ProductTypes";

export type TableType = {
  id: number;
  name: string;
  orders: OrderType[];
  _count: {
    orders: number;
  };
};

export type SimpleTableType = {
  id: number;
  name: string;
};

export type UserType = {
  id: number;
  username: string;
  name: string;
};

export type SimpleUserType = {
  id: number;
  username: string;
  name: string;
};

export type TableSectionType = {
  name: string;
  ordersCount: number;
  orders: OrderType[];
};

export type OrderProductType = {
  amount: number;
  comment: string;
  product: ProductType;
  orderId: number;
  productId: number;
};

export type FinalOrderProductType = {
  id: number;
  name: string;
  amount: number;
  price: string;
  total: string;
};

export type FinalOrderType = {
  id: number;
  name: string;
  createdAt: Date;
  creator: SimpleUserType;
  Table: SimpleTableType | null;
  finalProducts: FinalOrderProductType[];
  total: string;
};

export type SimpleOrderType = {
  id: number;
  name: string;
  Table: SimpleTableType | null;
};

export type OrderType = {
  id: number;
  name: string;
  creator: UserType;
  Table: SimpleTableType;
  OrderProduct: OrderProductType[];
};
