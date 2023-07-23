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

export type OrderType = {
  id: number;
  name: string;
  userId: number;
  tableId: number | null;
  creator: UserType;
};
