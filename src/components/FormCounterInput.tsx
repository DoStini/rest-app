import { useEffect, useMemo, useState } from "react";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { AiFillCheckSquare, AiFillDelete, AiOutlineUndo } from "react-icons/ai";
import { IoArrowUndoCircle } from "react-icons/io5";

type CounterInputType = {
  defaultValue: number;
  min: number;
  max: number;
  name: string;
};

export default function FormCounterInput({
  defaultValue,
  min,
  max,
  name,
}: CounterInputType) {
  const [value, setValue] = useState(defaultValue);
  const valueChanged = useMemo(
    () => value != defaultValue,
    [value, defaultValue]
  );

  useEffect(() => {
    if (defaultValue < min) {
      setValue(min);
      return;
    }
    if (defaultValue > max) {
      setValue(max);
      return;
    }

    setValue(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname, min, max]);

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
      <div className={`text-2xl px-2 cursor-pointer`} onClick={decrement}>
        <FiMinusCircle></FiMinusCircle>
      </div>

      <div className="text-md w-4 text-right">{value}</div>
      <input value={value} hidden name={name}></input>

      <div className={`text-2xl px-2 cursor-pointer $`} onClick={increment}>
        <FiPlusCircle></FiPlusCircle>
      </div>
    </div>
  );
}
