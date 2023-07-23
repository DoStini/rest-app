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
  password: string;
  createdAt: Date;
};

export type TableSectionType = {
  name: string;
  ordersCount: number;
  orders: OrderType[];
};

export type ProductType = {
  id: number;
  name: string;
  image: string | undefined;
  price: number;
};

export type OrderProductType = {
  amount: number;
  comment: string;
  product: ProductType;
  orderId: number;
  productId: number;
};

export type OrderType = {
  id: number;
  name: string;
  creator: UserType;
  Table: SimpleTableType;
  OrderProduct: OrderProductType[];
};
