"use server";

import { Printer } from "@/app/services/Printer";
import { TableController } from "@/controllers/TableControllers";
import ROUTES from "@/helpers/constants/Routes";
import { redirect } from "next/navigation";

export const printOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  const order = await TableController.generateOrder(orderId);
  await Printer.printOrder(order);
};

export const openOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  await TableController.reopenOrder(orderId);
};

export const requestOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  const amounts = [];

  for (const key of Array.from(data.keys())) {
    if (key === "orderId") continue;
    const productId = parseInt(key);
    const amount = parseInt(data.get(key)?.toString() || "");
    amounts.push({ productId, amount });
  }

  await TableController.requestOrder(orderId, amounts);

  redirect(ROUTES.PAGES.ORDERS.BY_ID(orderId));
  // await Printer.printOrder(order);
};
