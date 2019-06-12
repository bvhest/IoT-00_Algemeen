# model SZYTF

## Specificaties

#### Bijzonderheden
Merknaam:SZYTF
Uitvoer:Analog 
SensorType:Humidity Sensor
Materiaal:MixtureModelnummer:sensor

#### Productbeschrijving
**Kenmerken**
Ondersteunt Zwaartekracht 3-Pin interface
Analoge uitgang
 
**Toepassingen**
Tuin planten
Vocht detectie
Intelligente landbouw
 
**Specificatie**
Werkspanning: 3.3 - 5.5 VDC
Uitgangsspanning: 0 - 3.0VDC
Interface: PH2.0-3P
Afmetingen: 98mm * 23mm (3.86in x 0.905in)
Gewicht: 15g

## Calibratie

datum: Thursday, 30. May 2019 04:48PM 

temperature= 21.05 C
rel.vochtigheid lucht= 50%

Obv linearire regressie (zie script `calibratie.r`):
```
moisture = 127.5415 - 0.2025 * adc.read()
```

## Overige

#### Probleem met upload van python files

Oorzaak: sensor hangt aan ADC0. Deze poort wordt ook door de USB gebruikt.
Oplossing: sensor signaal-kabeltje tijdelijk los trekken.



## Projecten met identieke sensor

### project 1
[Capacitive Soil Moisture Sensor v1.2 with Wemos D1 Lite (arduino)](https://maker.pro/esp8266/projects/capacitive-soil-moisture-sensor-v12-with-wemos-d1-lite-arduino-ide)

### project 2

from [Capacitive Soil Moisture Sensor Wemos ESPeasy](https://www.domoticz.com/forum/viewtopic.php?t=24116):

I have inverted the formula, to correspond the Soil Moisture sensor values in Domoticz (using theme Aurora)
```
00 - 09 --> "saturated
10 - 19 --> "adequately wet"
20 - 59 --> "irrigation advice"
60 - 99 --> "irrigation"
> 99 --> "Dangerously dry"
```
(definitions from this post viewtopic.php?t=23443#p180501)

now the formula is: (%value%-350)/(800-350)*100
where the values are 350 = sensor in the water, 800 = dry sensor - not real clay values!
I used the same sensor - DIY More Capacitive Soil Moisture Sensor v1.2


Next challenge is to make the capacitive moisture sensor water proof. Have a look at my banana collection

1. cut out some plastic of the connector and clamp and solder a telephone wire:
2. Use a 2 cm diameter hose 
3. Fill up the inside with silicone

### project 3

found on [Python/MicroPython IoT Framework Example - Auto Irrigation](https://www.hackster.io/bobbyleonard84/python-micropython-iot-framework-example-auto-irrigation-6286ae)

