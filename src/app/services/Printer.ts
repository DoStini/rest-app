import { ProductsController } from "@/controllers/ProductsController";
import { formatDateWithTime } from "@/helpers/time";
import { DayType } from "@/types/DayTypes";
import {
  FinalOrderProductType,
  FinalOrderType,
  OrderType,
} from "@/types/TableTypes";
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
            type: "order",
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

  static async printDay(products: FinalOrderProductType[], day: DayType) {
    const producer = await Printer.KafkaProducer();

    return await producer.send({
      topic: "order-print",
      messages: [
        {
          value: JSON.stringify({
            type: "day",
            order: products,
            openTime: formatDateWithTime(day.createdAt),
            closeTime: formatDateWithTime(day.closedAt || new Date()),
            total: day.total.toFixed(2),
          }),
        },
      ],
    });
  }

  static async printRequest(
    waiter: string,
    openTime: Date,
    tableName: string,
    amounts: { productId: number; amount: number }[]
  ) {
    const producer = await Printer.KafkaProducer();

    const amountsWithProducts = await Promise.all(
      amounts.map(async (item) => {
        const product = await ProductsController.findProductById(
          item.productId
        );
        return {
          name: product?.name,
          amount: item.amount,
        };
      })
    );

    return await producer.send({
      topic: "order-print",
      messages: [
        {
          value: JSON.stringify({
            type: "request",
            order: amountsWithProducts,
            waiter,
            table: tableName,
            openTime: formatDateWithTime(openTime),
          }),
        },
      ],
    });
  }

  private static async KafkaProducer() {
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
    return producer;
  }
}
