"use client"

import { useEffect, useState } from "react";

export type FormType = {
  action?: string | ((formData: FormData) => void) | undefined;
  className?: string;
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onInvalid?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({
  action,
  children,
  className,
}: FormType) {
  const [ref, setRef] = useState<HTMLFormElement | null>(null);
  const [button, setButton] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = ref?.querySelector("button[type=submit]") as HTMLButtonElement;
    setButton(btn);
  }, [ref]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submit")
    button?.dispatchEvent(new Event("submit"));
  };

  return (
    <form
      ref={(el) => setRef(el)}
      action={action}
      className={`flex flex-col ${className || ""}`}
      onSubmit={onSubmit}
      onInvalid={(e) => console.log("invalid")}
    >
      {children}
    </form>
  );
}