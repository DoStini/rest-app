import Divider from "./Divider";

export default function CommonHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-between items-center text-textPrimary my-5">
        {children}
      </div>
      <Divider />
    </>
  );
}
