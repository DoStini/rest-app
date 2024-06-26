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

export const saveComment = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");
  const productId = parseInt(data.get("productId")?.toString() || "");
  const comment = data.get("comment")?.toString() || "";

  if (!orderId || !productId) return;

  await TableController.saveComment(orderId, productId, comment);
};

export const requestOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  const amounts = [];

  for (const key of Array.from(data.keys())) {
    if (key === "orderId") continue;
    if (key.endsWith("-comment")) continue;

    const productId = parseInt(key);
    const amount = parseInt(data.get(key)?.toString() || "");
    const comment = data.get(`${key}-comment`)?.toString() || "";
    if (!amount) continue;
    amounts.push({ productId, amount, comment });
  }

  const order = await TableController.getPrintableOrderProducts(orderId);
  if (!order) return;

  const waiter = order.creator?.name || "";
  const openTime = order.createdAt || new Date();
  const tableName = `${order.Table?.name}, ${order.name}`;

  await TableController.requestOrder(orderId, amounts);
  await Printer.printRequest(waiter, openTime, tableName, amounts);

  redirect(ROUTES.PAGES.ORDERS.BY_ID(orderId));
};
