from confluent_kafka import Consumer
import json


def read_ccloud_config(config_file):
    conf = {}
    with open(config_file) as fh:
        for line in fh:
            line = line.strip()
            if len(line) != 0 and line[0] != "#":
                parameter, value = line.strip().split('=', 1)
                conf[parameter] = value.strip()
    return conf


props = read_ccloud_config(".env.local")
props["group.id"] = "python-group-1"
props["auto.offset.reset"] = "earliest"

consumer = Consumer(props)
consumer.subscribe(["order-print"])

# value coming from the topic
# const waiter = order.creator;
# const initialTime = order.createdAt;
# const closeTime = order.closedAt;

# const mappedOrder = order.OrderProduct.map((item) => {
#   return {
#     name: item.product.name,
#     amount: item.amount,
#     price: item.product.price,
#     total: round2(round2(item.product.price) * item.amount),
#   };
# });

# print data coming from the topic
# const waiter = order.creator;
# const initialTime = order.createdAt;
# const closeTime = order.closedAt;

# const mappedOrder = order.OrderProduct.map((item) => {
#   return {
#     name: item.product.name,
#     amount: item.amount,
#     price: item.product.price,
#     total: round2(round2(item.product.price) * item.amount),
#   };
# });


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
    while True:
        msg = consumer.poll(1.0)
        if msg is not None and msg.error() is None:
            json_data = json.loads(msg.value().decode('utf-8'))
            print(json_data)

            print_order(json_data)

except KeyboardInterrupt:
    pass
finally:
    consumer.close()
