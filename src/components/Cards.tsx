import { AiOutlineRight } from "react-icons/ai";

type LinkCardType = {
  title: string;
  description: string;
};

export function OrderCard({ title, description }: LinkCardType) {
  return (
    <div className="my-1 p-4 md:p-5 bg-primary">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
            {title}
          </h3>
          <p className="text-sm text-gray-500">Responsável: {description}</p>
        </div>
      </div>
    </div>
  );
}
