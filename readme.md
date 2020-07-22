# Portable Humidity Logger
A battery powered Raspberry Pi Zero W using a DHT22 sensor to log regular humidity readings.

This repository accompanies a Medium article [here](https://medium.com/@tom.humph/monitoring-damp-with-a-raspberry-pi-zero-w-3b18b06c2e9)

![DHT22](./docs/dht22.jpg)

## DHT22 sensor wiring
![DHT22 wiring](./docs/GPIO-wiring.jpg)
GPIO pins 1 (3V3 power), 7 (GPIO 4), 6 (Ground)


![sensor wiring](./docs/sensor-wiring.jpg)
10k ohm resistor


## Interface
![menu](./docs/screenshot-menu.jpg)
Changing the "measurement name" changes the directory that the data is saved to.

![charts](./docs/screenshot-charts.jpg)
Viewing the data in the files.