"use client";
import { ProductCard } from "@/components/Cards";
import CommonHeader from "@/components/orders/CommonHeader";
import { jsonPost } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectNotFound } from "@/helpers/router";
import { CategoryType, ProductOrderType } from "@/types/ProductTypes";
import { SimpleOrderType } from "@/types/TableTypes";
import { FetcherCategoryPageType, SwrCategoryPageType } from "@/types/swrTypes";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import useSwr, { useSWRConfig } from "swr";

export default function AddProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { id } = params;
  const { data, isLoading }: SwrCategoryPageType =
    useSwr<FetcherCategoryPageType>(
      ROUTES.API.ORDERS.BY_ID_WITH_CATEGORIES(id),
      fetcher
    );

  const { mutate } = useSWRConfig();
  const refresh = () => mutate(ROUTES.API.ORDERS.BY_ID_WITH_CATEGORIES(id));

  const [selected, setSelected] = useState(0);
  const [initialLoad, setInitialLoad] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (data?.data.categories && !initialLoad) {
      setSelected(data.data.categories[0].id);
      setInitialLoad(true);
    }
  }, [data, initialLoad]);

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return redirectNotFound(router);
  }

  if (data.status === 404) {
    return redirectNotFound(router);
  }

  const { order, categories } = data.data;

  const products = categories
    .find((category) => category.id === selected)
    ?.products.filter((product) =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );

  if (!products) {
    return <></>;
  }

  return (
    <div>
      <Header order={order} selected={selected}></Header>;
      <Categories
        setSelected={setSelected}
        categories={categories}
        selected={selected}
      ></Categories>
      <input
        className="w-full text-sm text-textPrimary bg-secondary mt-2 p-2 focus:outline-none"
        onChange={(evt) => setFilter(evt.target.value)}
        placeholder="Produto a pesquisar..."
      ></input>
      <ProductList
        products={products}
        refresh={refresh}
        orderId={order.id}
      ></ProductList>
    </div>
  );
}

const Categories = ({
  categories: produdcts,
  selected,
  setSelected,
}: {
  categories: CategoryType[];
  selected: number;
  setSelected: (id: number) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      {produdcts.map((category) => (
        <div
          className={`text-textSecondary text-xs p-3 max-w-sm text-center cursor-pointer
            ${
              category.id === selected ? "text-bold bg-primary" : "bg-tertiary"
            }`}
          key={category.id}
          onClick={() => setSelected(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
};

const ProductList = ({
  orderId,
  products,
  refresh,
}: {
  orderId: number;
  products: ProductOrderType[];
  refresh: () => Promise<any>;
}) => {
  return (
    <div className="grid-cols-1 divide-y divide-separator pt-2">
      {products?.map((product) => (
        <ProductCard
          key={`${product}`}
          name={product.name}
          amount={product.orderProduct.at(0)?.amount || 0}
          orderId={orderId}
          productId={product.id}
          refresh={refresh}
        ></ProductCard>
      ))}
    </div>
  );
};

const Header = ({
  order,
  selected,
}: {
  order: SimpleOrderType;
  selected: number;
}) => {
  return (
    <CommonHeader>
      <Link href={ROUTES.PAGES.ORDERS.BY_ID(order.id)} className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">{`${order.Table?.name}, ${order.name}`}</h1>
    </CommonHeader>
  );
};
