# Instalation

If there is problems in using the kafka python library. This was to use confluent python library, but was impossible to run in raspberry pi

```
sudo apt purge librdkafka1 librdkafka-dev

git clone https://github.com/edenhill/librdkafka.git
cd librdkafka
./configure --prefix /usr
make
sudo make install
```

Install python packages

`sudo pip3 install -r requirements.txt`

# Running
