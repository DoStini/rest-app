"use client";
import { ProductCard } from "@/components/Cards";
import LinkButton from "@/components/LinkButton";
import CommonHeader from "@/components/orders/CommonHeader";
import { REFRESH_INTERVAL, jsonPost } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { fetcher } from "@/helpers/fetcher";
import { redirectNotFound } from "@/helpers/router";
import { CategoryType, ProductOrderType } from "@/types/ProductTypes";
import { SimpleOrderType } from "@/types/TableTypes";
import { FetcherCategoryPageType, SwrCategoryPageType } from "@/types/swrTypes";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiTool } from "react-icons/fi";
import useSwr, { useSWRConfig } from "swr";

export default withPageAuthRequired<{ params: { id: string } }>(
  function AddProductPage({
    params,
    user,
  }: {
    params: { id: string };
    user: UserProfile;
  }) {
    const router = useRouter();

    const { id } = params;
    const { data, isLoading }: SwrCategoryPageType =
      useSwr<FetcherCategoryPageType>(
        ROUTES.API.ORDERS.BY_ID_WITH_CATEGORIES(id),
        fetcher,
        { refreshInterval: REFRESH_INTERVAL }
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
      redirectNotFound(router);
      return <></>;
    }

    if (data.status === 404) {
      redirectNotFound(router);
      return <></>;
    }

    const { order, categories } = data.data;

    if (order.closed) {
      router.push(ROUTES.PAGES.ORDERS.BY_ID(order.id));
      return <></>;
    }

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
        <LinkButton
          className="bg-tertiary text-textSecondary m-auto mt-10"
          href={ROUTES.PAGES.ORDERS.CUSOTM_BY_ID(order.id)}
          text="Produto Manual"
          preElement={<FiTool />}
        />
      </div>
    );
  }
);

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
          key={`root-product-${product.id}`}
          name={product.name}
          closed={false}
          amount={product.orderProduct.at(0)?.amount || 0}
          orderId={orderId}
          productId={product.id}
          comment={product.orderProduct.at(0)?.comment || null}
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
