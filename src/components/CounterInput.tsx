import { useEffect, useMemo, useState } from "react";
import { FiCheckSquare, FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { BsFillCheckSquareFill } from "react-icons/bs";

type CounterInputType = {
  defaultValue: number;
  min: number;
  max: number;
  onChangeSave: (amount: number) => void;
};

export default function CounterInput({
  defaultValue,
  min,
  max,
  onChangeSave,
}: CounterInputType) {
  const [value, setValue] = useState(defaultValue);
  const valueChanged = useMemo(
    () => value != defaultValue,
    [value, defaultValue]
  );

  const decrement = () => {
    if (value <= min) {
      return;
    }
    setValue((previous) => previous - 1);
  };

  const increment = () => {
    if (value >= max) {
      return;
    }

    setValue((previous) => previous + 1);
  };

  return (
    <div className="flex flex-row text-textSecondary items-center">
      <div className="text-xl px-2 cursor-pointer" onClick={decrement}>
        <FiMinusCircle></FiMinusCircle>
      </div>
      <div className="text-md">{value}</div>
      <div className="text-xl px-2 cursor-pointer" onClick={increment}>
        <FiPlusCircle></FiPlusCircle>
      </div>
      <div
        className={`text-xl pl-4 text-success ${
          valueChanged ? "cursor-pointer" : "invisible"
        }`}
        onClick={() => onChangeSave(value)}
      >
        <BsFillCheckSquareFill></BsFillCheckSquareFill>
      </div>
    </div>
  );
}
