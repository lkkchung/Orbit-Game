#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void setup() {
  Serial.begin(9600);

  // wait until serial port opens for native USB devices
  while (! Serial) {
    delay(1);
  }

//  Serial.println("Adafruit VL53L0X test");
  if (!lox.begin()) {
//    Serial.println(F("Failed to boot VL53L0X"));
    while (1);
  }
  // power
//  Serial.println(F("VL53L0X API Simple Ranging example\n\n"));
}


void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  int dist = 0;

//    Serial.print("Reading a measurement... ");
    lox.rangingTest(&measure, false); // pass in 'true' to get debug data printout!

  if (measure.RangeStatus != 4) {  // phase failures have incorrect data
    //    Serial.print("Distance (mm): ");
    dist = measure.RangeMilliMeter;
  } else {
    dist = 0;
  }

  int distValue = map(dist, 45, 120, 0, 120);

  Serial.print(distValue);

  Serial.print(",");

  int pot = analogRead(A0);

  int potValue = map(pot, 691, 374, 45, -45);
  Serial.println(potValue);

  delay(100);
}
