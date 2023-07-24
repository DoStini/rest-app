import { useEffect, useMemo, useState } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { AiFillCheckSquare, AiFillDelete, AiOutlineUndo } from "react-icons/ai";
import { IoArrowUndoCircle } from "react-icons/io5";

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

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

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
        className={`text-2xl
          ${disabled && "cursor-not-allowed text-separator"} 
          ${valueChanged ? "cursor-pointer" : "invisible"} 
          ${!disabled && "text-warning"}
        `}
        onClick={() => setValue(defaultValue)}
      >
        <AiOutlineUndo></AiOutlineUndo>
      </div>

      <div
        className={`text-2xl pl-3
          ${disabled && "cursor-not-allowed text-separator"} 
          ${valueChanged ? "cursor-pointer" : "invisible"} 
          ${value > 0 && !disabled && "text-success"}
          ${value <= 0 && !disabled && "text-warning"}
        `}
        onClick={() => onChangeSave(value)}
      >
        {value > 0 ? (
          <AiFillCheckSquare></AiFillCheckSquare>
        ) : (
          <AiFillDelete></AiFillDelete>
        )}
      </div>

      <div
        className={`text-xl px-2 cursor-pointer ${
          disabled && "cursor-not-allowed text-separator"
        }`}
        onClick={decrement}
      >
        <FiMinusCircle></FiMinusCircle>
      </div>

      <div className="text-md w-4 text-right">{value}</div>

      <div
        className={`text-xl px-2 cursor-pointer ${
          disabled && "cursor-not-allowed text-separator"
        }`}
        onClick={increment}
      >
        <FiPlusCircle></FiPlusCircle>
      </div>
    </div>
  );
}
