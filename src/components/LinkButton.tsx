"use client";
import Link from "next/link";
import { useState } from "react";
import Spinner from "./Spinner";

type ButtonType = {
  className: string;
  text: string;
  href: string;
  preElement: React.ReactNode;
  disabled?: boolean;
};

export default function LinkButton({
  href,
  className,
  preElement: preIcon,
  text,
  disabled,
}: ButtonType) {
  const [loading, setLoading] = useState(false);

  console.log("link button", loading);

  const clickHandler = (e: React.MouseEvent) => {
    if (!disabled && !loading) {
      setLoading(true);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      href={href}
      aria-disabled={disabled || loading}
      onClick={clickHandler}
      className={`
      ${(disabled || loading) && "!bg-separator"}
      ${
        className || ""
      } flex flex-row text-md justify-center w-full py-3 max-w-md`}
    >
      <div className="text-2xl px-2">{loading ? <Spinner /> : preIcon}</div>
      {text}
    </Link>
  );
}
