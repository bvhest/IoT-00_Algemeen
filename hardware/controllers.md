# Controllers

### Keuze


### Opties

  1.[ESP8266 WiFi module](https://bikealive.nl/esp8266-nl.html) 5,00 euro, met mogelijkheid om micropython of Aduino te gebruiken.
  1. [Wemos LOLIN D1 Mini Pro V2 - ESP8266 - CH340C](https://www.tinytronics.nl/shop/nl/arduino/wemos/wemos-lolin-d1-mini-pro-v2-esp8266-ch340c) 8,50 euro  
  micropython/arduino/nog iets...
  2. [Pycom FiPy](https://www.tinytronics.nl/shop/nl/platforms/pycom/pycom-fipy) 61,00 euro
  3. [Raspberry Pi 3 Model B+ 1GB](https://www.tinytronics.nl/shop/nl/raspberry-pi/main-boards/raspberry-pi-3-model-b-1gb-1) 38,50 euro
  3. [Raspberry Pi 3 Model A+ 512MB](https://www.tinytronics.nl/shop/nl/raspberry-pi/main-boards/raspberry-pi-3-model-a-512mb) 28,00 euro
  
  
### boards

  1. [Pycom Expansion Board 3.0](https://www.tinytronics.nl/shop/nl/platforms/pycom/pycom-expansion-board-2.0) 19,00 euro  
 Zie ook [Pycome](https://pycom.io/?s=board). En de [details](https://docs.pycom.io/datasheets/boards/expansion3.html).
  2. [Pycom Pysense](https://www.tinytronics.nl/shop/nl/platforms/pycom/pycom-pysense) 30,00 euro


### one board computers

  1. [odroid-c2](https://www.hardkernel.com/shop/odroid-c2/)


## Documentatie

### I2C

I2C is a two-wire protocol for communicating between devices. At the physical level it consists of 2 wires: SCL and SDA, the clock and data lines respectively.

I2C objects are created attached to a specific bus. They can be initialised when created, or initialised later on.

  * [Pycom I2C](https://docs.pycom.io/firmwareapi/pycom/machine/i2c.html)

### SPI

SPI is a serial protocol that is driven by a master. At the physical level there are 3 lines: SCK, MOSI, MISO.

See usage model of I2C; SPI is very similar. Main difference is parameters to init the SPI bus.

  * [Pycom SPI](https://docs.pycom.io/firmwareapi/pycom/machine/spi.html)