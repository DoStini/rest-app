type ButtonType = {
  className: string;
  type: "button" | "submit" | "reset" | undefined;
  action: string | ((formData: FormData) => void) | undefined;
  text: string;
  preElement: React.ReactNode;
};

export default function Button({
  type,
  action,
  className,
  preElement: preIcon,
  text,
}: ButtonType) {
  return (
    <button
      type={type}
      className={`${
        className || ""
      } flex flex-row text-md justify-center w-full py-3 max-w-md`}
      formAction={action}
    >
      <div className="text-2xl px-2">{preIcon}</div>
      {text}
    </button>
  );
}
