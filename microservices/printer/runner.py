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

try:
  while True:
    msg = consumer.poll(1.0)
    if msg is not None and msg.error() is None:
      json_data = json.loads(msg.value().decode('utf-8'))
      print(json_data)
except KeyboardInterrupt:
  pass
finally:
      consumer.close()
