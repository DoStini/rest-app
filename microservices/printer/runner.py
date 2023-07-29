from datetime import datetime
from time import sleep
from kafka import KafkaConsumer
import json
import dotenv
from escpos.printer import Usb

consumer = None
printer = None


def startup():
    global consumer, printer
    config = {
        **dotenv.dotenv_values(".env"),
        **dotenv.dotenv_values(".env.local"),
    }

    print("Printer service started")

    consumer = KafkaConsumer(
        bootstrap_servers=config["KAFKA_SERVERS"],
        security_protocol="SASL_SSL",
        sasl_mechanism="PLAIN",
        sasl_plain_username=config["KAFKA_USERNAME"],
        sasl_plain_password=config["KAFKA_PASSWORD"],
    )
    consumer.subscribe(["order-print"])

    printer = Usb(
        int(config["PRINTER_ID_VENDOR"], 16),
        int(config["PRINTER_ID_PRODUCT"], 16),
        in_ep=int(config["PRINTER_IN_EP"], 16),
        out_ep=int(config["PRINTER_OUT_EP"], 16),
    )

    printer.text("Connected to cloud\n")
    printer.cut()
    print("Printer connected")


def printer_print_order(order):
    printer.text(f"Atendido por: {order['waiter']}\n")
    printer.text(f"Abertura: {order['openTime']}\n")
    printer.text(f"Fecho: {order['closeTime']}\n")
    printer.text("\nCompras: \n")
    for item in order["order"]:
        item_amount = "{:>2}".format(item["amount"])
        item_name = "{:<18}".format(item["name"])
        item_total = "{:>6}".format(item["total"])
        item_price = "{:>5}".format(item["price"])

        printer.text(
            f"{item_name}      {item_amount} x {item_price}€      {item_total}€\n")

    total = "{:>5}".format(order["total"])
    printer.text(f"\n\nTotal: {total}€\n\n\n")
    printer.text("Obrigado pela sua visita!\n\n\n")


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
        item_price = "{:>5}".format(item["price"])
        print(
            f"{item_name}      {item_amount} x {item_price}€      {item_total}€")

    total = "{:>5}".format(order["total"])
    print(f"\n\nTotal: {total}€")


while True:
    try:
        startup()
    except Exception as e:
        # write exception to log file
        current_timestamp = datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
        with open(f"logs/printer{current_timestamp}.log", "w") as f:
            f.write(str(e))

        print("Error starting the printer service")
        print(e)
        sleep(2)
        continue
    break

print("Start listening to kafka messages")

try:
    for msg in consumer:
        print(msg)
        if msg is not None:
            json_data = json.loads(msg.value.decode('utf-8'))
            print(json_data)

            print_order(json_data)
            printer_print_order(json_data)
            printer.cut()

except KeyboardInterrupt:
    pass
finally:
    consumer.close()
