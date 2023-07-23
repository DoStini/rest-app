import { AiOutlineRight } from "react-icons/ai";
import CounterInput from "./CounterInput";

type LinkCardType = {
  title: string;
  description: string;
};

type ProductCardType = {
  name: string;
  amount: number;
  onChangeSave: (amount: number) => void;
  loading: boolean;
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
  amount,
  onChangeSave,
  loading,
}: ProductCardType) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary text-sm flex flex-row justify-between items-center">
        <h3>{name}</h3>
        <CounterInput
          defaultValue={amount}
          min={0}
          max={Infinity}
          onChangeSave={onChangeSave}
          disabled={loading}
        ></CounterInput>
      </div>
    </div>
  );
}
