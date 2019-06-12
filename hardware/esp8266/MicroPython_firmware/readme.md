
followed the procedure described on https://bigl.es/tooling-tuesday-wemos-d1-mini-micropython/


>dmesg

[19841.285219] usbcore: registered new interface driver usbserial
[19841.285263] usbcore: registered new interface driver usbserial_generic
[19841.285272] usbserial: USB Serial support registered for generic
[19841.286874] usbcore: registered new interface driver ch341
[19841.286885] usbserial: USB Serial support registered for ch341-uart
[19841.286893] ch341 1-3:1.0: ch341-uart converter detected
[19841.287573] usb 1-3: ch341-uart converter now attached to ttyUSB0

Notice the last line? It mentions [ 4869.706963] usb 1-2: ch341-uart converter now attached to ttyUSB0 well that is our Wemos D1 Mini. The full path to our device is /dev/ttyUSB0


>esptool.py --port /dev/ttyUSB0 erase_flash

esptool.py v2.6
Serial port /dev/ttyUSB0
Connecting....
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
MAC: cc:50:e3:c4:99:1e
Uploading stub...
Running stub...
Stub running...
Erasing flash (this may take a while)...
Chip erase completed successfully in 6.8s
Hard resetting via RTS pin...


> esptool.py  --port /dev/ttyUSB0 --baud 460800 write_flash -fm dio --flash_size=detect 0 esp8266-20190125-v1.10.bin

esptool.py v2.6
Serial port /dev/ttyUSB0
Connecting....
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
MAC: cc:50:e3:c4:99:1e
Uploading stub...
Running stub...
Stub running...
Changing baud rate to 460800
Changed.
Configuring flash size...
Auto-detected Flash size: 4MB
Flash params set to 0x0240
Compressed 615388 bytes to 399928...
Wrote 615388 bytes (399928 compressed) at 0x00000000 in 9.0 seconds (effective 547.6 kbit/s)...
Hash of data verified.

Leaving...
Hard resetting via RTS pin...
