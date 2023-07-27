import { formatDateWithTime } from "@/helpers/time";
import { FinalOrderType } from "@/types/TableTypes";
import { Kafka } from "kafkajs";

export class Printer {
  static async printOrder(order: FinalOrderType) {
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

    return await producer.send({
      topic: "order-print",
      messages: [
        {
          value: JSON.stringify({
            order: order.finalProducts,
            waiter: order.creator.name,
            openTime: formatDateWithTime(order.createdAt),
            closeTime: formatDateWithTime(),
            total: order.total,
          }),
        },
      ],
    });
  }
}
