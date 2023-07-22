import { AiOutlineRight } from "react-icons/ai";

type LinkCardType = {
  title: string;
  description: string;
};

export function OrderCard({ title, description }: LinkCardType) {
  return (
    <div className="p-4 md:p-5 bg-primary">
      <div className="text-textSecondary flex justify-between items-center">
        <div>
          <h3 className="text-lg">{title}</h3>
          <p className="text-sm text-gray-500">Responsável: {description}</p>
        </div>
      </div>
    </div>
  );
}
