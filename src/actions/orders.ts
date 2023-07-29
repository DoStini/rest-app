"use server";

import { Printer } from "@/app/services/Printer";
import { TableController } from "@/controllers/TableControllers";

export const printOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  const order = await TableController.generateOrder(orderId);
  await Printer.printOrder(order);
};

export const openOrder = async (data: FormData) => {
  const orderId = parseInt(data.get("orderId")?.toString() || "");

  await TableController.reopenOrder(orderId);
};
