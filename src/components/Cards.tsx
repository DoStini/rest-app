import { AiOutlineRight } from "react-icons/ai";
import CounterInput from "./CounterInput";
import { useEffect, useState } from "react";
import { jsonPost } from "@/helpers/api";
import ROUTES from "@/helpers/constants/Routes";
import { useRouter } from "next/navigation";

type LinkCardType = {
  title: string;
  description: string;
};

type ProductCardType = {
  name: string;
  orderId: number;
  productId: number;
  amount: number;
  refresh: () => Promise<any>;
};

export function OrderCard({ title, description }: LinkCardType) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary flex justify-between items-center">
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-sm">Responsável: {description}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  name,
  orderId,
  productId,
  amount,
  refresh,
}: ProductCardType) {
  const [isLoading, setIsLoading] = useState(false);

  const onAmountChanged = (
    orderId: number,
    productId: number,
    amount: number
  ) =>
    jsonPost(ROUTES.API.ORDERS.UPDATE(orderId, productId), { amount }).then(
      () => refresh().then(() => setIsLoading(false))
    );

  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary text-sm flex flex-row justify-between items-center">
        <h3>{name}</h3>
        <CounterInput
          defaultValue={amount}
          min={0}
          max={Infinity}
          onChangeSave={(amount) => {
            setIsLoading(true);
            onAmountChanged(orderId, productId, amount);
          }}
          disabled={isLoading}
        ></CounterInput>
      </div>
    </div>
  );
}
