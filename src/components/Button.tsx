"use client";
import { useEffect, useRef, useState } from "react";
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
  const [ref, setRef] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ref?.addEventListener("submit", (e) => {
      setLoading(true);
    })
  }, [ref]);

  return (
    <button
      ref={(el) => setRef(el)}
      type={type}
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
