import { ProductsController } from "@/controllers/ProductsController";

export default async function AddProductPage() {
  const products = await ProductsController.listProductByCategory();
  console.log("AddProductPage");
  console.log(products);

  return <></>;
}
