import { Decimal } from "@prisma/client/runtime/library";

export type CategoryType = {
  id: number;
  name: string;
  products: ProductOrderType[];
};

export type ProductType = {
  id: number;
  name: string;
  image: string | undefined;
  price: number | Decimal;
  category: CategoryType;
};

export type CreateProductType = {
  name: string;
  price: number;
  categoryId: number;
};

export type ProductOrderType = {
  id: number;
  name: string;
  image: string | undefined;
  price: number;
  orderProduct: {
    amount: number;
    comment: string | null;
  }[];
};
