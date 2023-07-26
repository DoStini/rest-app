import Link from "next/link";

type ButtonType = {
  className: string;
  text: string;
  href: string;
  preElement: React.ReactNode;
};

export default function LinkButton({
  href,
  className,
  preElement: preIcon,
  text,
}: ButtonType) {
  return (
    <Link
      href={href}
      className={`${
        className || ""
      } flex flex-row text-md justify-center w-full py-3 max-w-md`}
    >
      <div className="text-2xl px-2">{preIcon}</div>
      {text}
    </Link>
  );
}
