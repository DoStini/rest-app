import { useMemo, useState } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { AiFillCheckSquare, AiFillDelete } from "react-icons/ai";

type CounterInputType = {
  defaultValue: number;
  min: number;
  max: number;
  disabled: boolean;
  onChangeSave: (amount: number) => void;
};

export default function CounterInput({
  defaultValue,
  min,
  max,
  disabled,
  onChangeSave,
}: CounterInputType) {
  const [value, setValue] = useState(defaultValue);
  const valueChanged = useMemo(
    () => value != defaultValue,
    [value, defaultValue]
  );

  const decrement = () => {
    if (value <= min || disabled) {
      return;
    }
    setValue((previous) => previous - 1);
  };

  const increment = () => {
    if (value >= max || disabled) {
      return;
    }

    setValue((previous) => previous + 1);
  };

  return (
    <div className="flex flex-row text-textSecondary items-center">
      <div
        className={`text-xl px-2 cursor-pointer ${
          disabled && "cursor-not-allowed text-separator"
        }`}
        onClick={decrement}
      >
        <FiMinusCircle></FiMinusCircle>
      </div>

      <div className="text-md">{value}</div>

      <div
        className={`text-xl px-2 cursor-pointer ${
          disabled && "cursor-not-allowed text-separator"
        }`}
        onClick={increment}
      >
        <FiPlusCircle></FiPlusCircle>
      </div>

      <div
        className={`text-2xl pl-4 ${
          value > 0 ? "text-success" : "text-warning"
        } ${valueChanged ? "cursor-pointer" : "invisible"} ${
          disabled && "cursor-not-allowed text-separator"
        } `}
        onClick={() => onChangeSave(value)}
      >
        {value > 0 ? (
          <AiFillCheckSquare></AiFillCheckSquare>
        ) : (
          <AiFillDelete></AiFillDelete>
        )}
      </div>
    </div>
  );
}
