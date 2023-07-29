import Link from "next/link";

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
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`
      ${disabled && "!bg-separator"}
      ${
        className || ""
      } flex flex-row text-md justify-center w-full py-3 max-w-md`}
    >
      <div className="text-2xl px-2">{preIcon}</div>
      {text}
    </Link>
  );
}
