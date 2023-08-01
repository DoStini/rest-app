import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Spinner() {
  return (
    <div className="motion-safe:animate-spin">
      <AiOutlineLoading3Quarters />
    </div>
  );
}
