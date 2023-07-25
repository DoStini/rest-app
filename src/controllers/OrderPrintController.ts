import { Kafka } from "kafkajs";
import { TableController } from "./TableControllers";
import { round2 } from "@/helpers/math";
import { dateWithTime } from "@/helpers/time";

export class OrderPrintController {
  static async GenerateOrder() {
    const kafka = new Kafka({
      clientId: "server",
      brokers: [process.env.SERVER!],
      ssl: true,
      sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_USERNAME!,
        password: process.env.KAFKA_PASSWORD!,
      },
    });

    const producer = kafka.producer();
    await producer.connect();

    const order = await TableController.getOrder(2);
    if (!order) return;

    const waiter = order.creator.username;
    const openTime = dateWithTime(order.createdAt);
    const closeTime = dateWithTime(order.closedAt || new Date());

    const mappedOrder = order.OrderProduct.map((item) => {
      return {
        name: item.product.name,
        amount: item.amount,
        price: item.product.price.toFixed(2),
        total: round2(round2(item.product.price) * item.amount).toFixed(2),
      };
    });

    const total = order?.OrderProduct.reduce((acc, item) => {
      return round2(acc + round2(round2(item.product.price) * item.amount));
    }, 0);

    return await producer.send({
      topic: "order-print",
      messages: [
        {
          value: JSON.stringify({
            order: mappedOrder,
            waiter,
            openTime,
            closeTime,
            total: total.toFixed(2),
          }),
        },
      ],
    });
  }
}
