/* 
 * Immersive Air Arduino Mega - MM - 10/11/20
 * Arduion Control File for PM2.5, CCS811, and SHT31-D sensors
 */
 

#include <SoftwareSerial.h>
#include "Adafruit_CCS811.h"
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"
#include <ArduinoJson.h>

SoftwareSerial pmsSerial(10, 11); // RX TX
SoftwareSerial espSerial(12,13); // RX TX
Adafruit_CCS811 ccs;
Adafruit_SHT31 sht31 = Adafruit_SHT31();


/*
 * PM2.5
 */
struct pms5003data {
  uint16_t framelen;
  uint16_t pm10_standard, pm25_standard, pm100_standard;
  uint16_t pm10_env, pm25_env, pm100_env;
  uint16_t particles_03um, particles_05um, particles_10um, particles_25um, particles_50um, particles_100um;
  uint16_t unused;
  uint16_t checksum;
};
 
struct pms5003data data;


/*
 * SHT31-D
 */
bool enableHeater = false;
uint8_t loopCnt = 0;

/*
 * Other Variables
 */

int tick = 0;
int tick2 = 0;

int particle1;
int particle2;
int particle3;
int particle4;
int particle5;
int particle6;
int co2;
int tvoc;
float temp;
float humid;

/*
 * Main Setup
 */
void setup() {
  // our debugging output
  Serial.begin(115200);

  // sensor baud rate is 9600
  pmsSerial.begin(9600);

  espSerial.begin(9600);

  if(!ccs.begin()){
    Serial.println("Failed to start sensor! Please check your wiring.");
    while(1);
  }

  // Wait for the sensor to be ready
  while(!ccs.available());

  if (! sht31.begin(0x44)) {
    Serial.println("Couldn't find SHT31");
    while (1);
  }

}


/*
 * Main Loop
 */
void loop() {

  pmsSerial.listen();
  
  if (readPMSdata(&pmsSerial)) {
    // reading data was successful!
    /*
    Serial.println();
    Serial.println("---------------------------------------");
    Serial.println("Concentration Units (standard)");
    Serial.print("PM 1.0: "); Serial.print(data.pm10_standard);
    Serial.print("\t\tPM 2.5: "); Serial.print(data.pm25_standard);
    Serial.print("\t\tPM 10: "); Serial.println(data.pm100_standard);
    Serial.println("---------------------------------------");
    Serial.println("Concentration Units (environmental)");
    Serial.print("PM 1.0: "); Serial.print(data.pm10_env);
    Serial.print("\t\tPM 2.5: "); Serial.print(data.pm25_env);
    Serial.print("\t\tPM 10: "); Serial.println(data.pm100_env);
    Serial.println("---------------------------------------");
    Serial.print("Particles > 0.3um / 0.1L air:"); Serial.println(data.particles_03um);
    Serial.print("Particles > 0.5um / 0.1L air:"); Serial.println(data.particles_05um);
    Serial.print("Particles > 1.0um / 0.1L air:"); Serial.println(data.particles_10um);
    Serial.print("Particles > 2.5um / 0.1L air:"); Serial.println(data.particles_25um);
    Serial.print("Particles > 5.0um / 0.1L air:"); Serial.println(data.particles_50um);
    Serial.print("Particles > 10.0 um / 0.1L air:"); Serial.println(data.particles_100um);
    Serial.println("---------------------------------------");
    */

    particle1 = data.particles_03um;
    particle2 = data.particles_05um;
    particle3 = data.particles_10um;
    particle4 = data.particles_25um;
    particle5 = data.particles_50um;
    particle6 = data.particles_100um;

    if(ccs.available()) {
      if(!ccs.readData()) {
        co2 = ccs.geteCO2();
        tvoc = ccs.getTVOC();
      }
    }

    temp = sht31.readTemperature();
    humid = sht31.readHumidity();

    /*
    if(!ccs.readData()){
      Serial.print("CO2: ");
      Serial.print(ccs.geteCO2());
      Serial.print("ppm, TVOC: ");
      Serial.println(ccs.getTVOC());
      Serial.println("---------------------------------------");
      
      co2 = ccs.geteCO2();
      tvoc = ccs.getTVOC();
    }

    else{
      Serial.println("ERROR WITH CSS811!!");
      Serial.println("---------------------------------------");
    }

    temp = sht31.readTemperature();
    humid = sht31.readHumidity();

    
    if (! isnan(temp)) {  // check if 'is not a number'
      Serial.print("Temp *C = "); Serial.print(temp); Serial.print("\t\t");
    } else { 
      Serial.println("Failed to read temperature");
    }

    if (! isnan(humid)) {  // check if 'is not a number'
      Serial.print("Hum. % = "); Serial.println(humid);
      Serial.println("---------------------------------------");
    } else { 
      Serial.println("Failed to read humidity");
      Serial.println("---------------------------------------");
    }
    */

    if (tick != 2) { tick += 1;};

    if (tick2 != 12) {tick2 +=1;};

    if (tick2 == 12) {
      tick2 = 0;
      prepJson();
    }
    
  }
  
  else{
    return;
  }
}


void prepJson() {
  DynamicJsonDocument doc(1024);

  doc["Particles>0.3um"] = particle1;
  doc["Particles>0.5um"] = particle2;
  doc["Particles>1.0um"] = particle3;
  doc["Particles>2.5um"] = particle4;
  doc["Particles>5.0um"] = particle5;
  doc["Particles>10.0um"] = particle6;
  doc["C02"] = co2;
  doc["TVOC"] = tvoc;
  doc["Temperature"] = temp;
  doc["Humidity"] = humid;

  //serializeJson(doc,espSerial);
  serializeJson(doc,Serial);
  //Serial.println("");
  Serial.println(millis());
}


/*
 * PM2.5 Action
 */
boolean readPMSdata(Stream *s) {
  if (! s->available()) {
    return false;
  }
  
  // Read a byte at a time until we get to the special '0x42' start-byte
  while (s->peek() != 0x42) {
    s->read();
    if (tick == 2) { Serial.println("byte is not 0x42"); }
  }
 
  // Now read all 32 bytes
  if (s->available() < 32) {
    return false;
  }
    
  uint8_t buffer[32];    
  uint16_t sum = 0;
  s->readBytes(buffer, 32);
 
  // get checksum ready
  for (uint8_t i=0; i<30; i++) {
    sum += buffer[i];
  }
  
  // The data comes in endian'd, this solves it so it works on all platforms
  uint16_t buffer_u16[15];
  for (uint8_t i=0; i<15; i++) {
    buffer_u16[i] = buffer[2 + i*2 + 1];
    buffer_u16[i] += (buffer[2 + i*2] << 8);
  }
 
  // put it into a nice struct :)
  memcpy((void *)&data, (void *)buffer_u16, 30);
 
  if (sum != data.checksum) {
    if (tick == 2) { Serial.println("Checksum failure"); }
    return false;
  }
  // success!
  return true;
}
