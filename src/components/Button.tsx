"use client";
import { useState } from "react";
import Spinner from "./Spinner";

type ButtonType = {
  className: string;
  type: "button" | "submit" | "reset" | undefined;
  action?: string | ((formData: FormData) => void) | undefined;
  text: string;
  preElement: React.ReactNode;
  disabled?: boolean;
};

export default function Button({
  type,
  className,
  preElement: preIcon,
  text,
  disabled,
}: ButtonType) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type={type}
      onClick={() => !disabled && !loading && setLoading(true)}
      disabled={disabled || loading}
      className={`${(disabled || loading) && "!bg-separator"} ${
        className || ""
      } flex flex-row text-md justify-center w-full py-3 max-w-md `}
    >
      <div className="text-2xl px-2">{loading ? <Spinner /> : preIcon}</div>
      {text}
    </button>
  );
}
