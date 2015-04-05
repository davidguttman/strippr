#include "FastLED.h"

// How many leds in your strip?
#define NUM_LEDS 40

// For led chips like Neopixels, which have a data line, ground, and power, you just
// need to define DATA_PIN.  For led chipsets that are SPI based (four wires - data, clock,
// ground, and power), like the LPD8806 define both DATA_PIN and CLOCK_PIN
#define DATA_PIN 2
#define CLOCK_PIN 3

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<WS2801, DATA_PIN, CLOCK_PIN, RGB>(leds, NUM_LEDS);
}

void loop() {
  while (Serial.available()) {
    Serial.readBytes( (char*)leds, NUM_LEDS * 3);
    FastLED.show();
  }

  delay(100);
}
