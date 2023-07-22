import CommonHeader from "@/components/orders/CommonHeader";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpLeft } from "react-icons/fi";

export default function CreateOrder() {
  return (
    <div className="">
      <Header />
    </div>
  );
}

const Header = () => {
  return (
    <CommonHeader>
      <Link href="/orders" className="text-3xl">
        <FiArrowLeft />
      </Link>
      <h1 className="text-2xl text-textPrimary">Nova conta</h1>
    </CommonHeader>
  );
};
