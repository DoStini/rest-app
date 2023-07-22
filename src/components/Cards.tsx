import { AiOutlineRight } from "react-icons/ai"

type LinkCardType = {
    title: string
    description: string
}

export function Card({title, description}: LinkCardType) {
    return (
        <div className="p-4 md:p-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800 dark:group-hover:text-gray-400 dark:text-gray-200">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="pl-3">
            <AiOutlineRight />
          </div>
        </div>
      </div>
    )
}
