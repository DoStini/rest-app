import { Kafka } from "kafkajs";

export class OrderPrintController {
  static async SendKafkaMessage() {
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
      messages: [{ value: "Hello KafkaJS user!" }],
    });
  }
}
