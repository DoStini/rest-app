export type CategoryType = {
  id: number;
  name: string;
  products: ProductOrderType[];
};

export type ProductType = {
  id: number;
  name: string;
  image: string | undefined;
  price: number;
};

export type ProductOrderType = {
  id: number;
  name: string;
  image: string | undefined;
  price: number;
  orderProduct: {
    amount: number;
  }[];
};
