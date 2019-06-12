# blink!
# 
# Ok for this we need a few components.
#
# - An LED
# - A 330 Ohm resistor (ORANGE-ORANGE-BROWN-GOLD)
# - Breadboard
# - Male to male jumper wires
#
# manually, from the console:
# screen /dev/ttyUSB0 115200



# We start by importing the Pin class from the machine library, as this will enable us to use the GPIO pins. We need to use a wait-time in the loop and import the sleep function from the time library. 
from machine import Pin
from time import sleep

# Next we create an object called led which will store the GPIO pin that we wish to use, and whether it is an input or an output. In this case it is an output as we wish to light up the LED.
led = Pin(16, Pin.OUT)

# So now we need to turn on the LED, and it is as easy as this!
led.on()

# wait 1 second 
sleep(1)

# And to turn off
led.off()

# All in an endless loop:
while True:
    led.on()
    sleep(0.3)
    led.off()
    sleep(0.3)


