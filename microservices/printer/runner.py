from kafka import KafkaConsumer
import json
import dotenv

config = {
    **dotenv.dotenv_values(".env"),
    **dotenv.dotenv_values(".env.local"),
}

consumer = KafkaConsumer(
    bootstrap_servers=config["KAFKA_SERVERS"],
    security_protocol="SASL_SSL",
    sasl_mechanism="PLAIN",
    sasl_plain_username=config["KAFKA_USERNAME"],
    sasl_plain_password=config["KAFKA_PASSWORD"],
)
consumer.subscribe(["order-print"])


def print_order(order):
    print(f"Atendido por: {order['waiter']}")
    print("Abertura: " + order["openTime"])
    print("Fecho: " + order["closeTime"])
    print("\nCompras: ")
    for item in order["order"]:
        # format the string to have 5 characters aligned right with spaces before
        item_amount = "{:>2}".format(item["amount"])

        # item_amount = "{:.2f}".format(item["amount"])
        item_name = "{:<20}".format(item["name"])
        item_total = "{:>5}".format(item["total"])
        item_price = "{:>4}".format(item["price"])
        print(
            f"{item_name}      {item_amount} x {item_price}      {item_total}€")

    total = "{:>5}".format(order["total"])
    print(f"\n\nTotal: {total}")


try:
    for msg in consumer:
        print(msg)
        if msg is not None:
            json_data = json.loads(msg.value.decode('utf-8'))
            print(json_data)

            print_order(json_data)

except KeyboardInterrupt:
    pass
finally:
    consumer.close()
