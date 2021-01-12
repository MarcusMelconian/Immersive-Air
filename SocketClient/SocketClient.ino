/*  
 *  ESP8226 SOCKETIO CLIENT - MM - 23/11/2020
 *  Web socket comms for NodeMCU
 *  Expects web socket server to use socket.io protocol
 */

/* 
 *  Headers below read standard Arduino, Wifi module, managment of multiple Wifi
 *  hotspots, hash codes, wire communication to Arduino
 */
 
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

SoftwareSerial fromArduino(D4, D5); // RX TX

String message = "";
bool messageReady = false;

/*
 * Use WiFiMulti so that we can can pre-set a chunk of possible access points
 */
ESP8266WiFiMulti WiFiMulti;

/*
 * Create WebSocket client object
 */
WebSocketsClient webSocket;

/*
 * In case we want to point output to another pipe instead of serialport
 */
#define USE_SERIAL Serial

/*
 * Settings for heart beat 
 * The heart beat is making sure that the server connection is still there
 * The values here are in milliseconds
 * The boolean is acting as a flag
 */
#define MESSAGE_INTERVAL 30000
#define HEARTBEAT_INTERVAL 25000
uint64_t messageTimestamp = 0;
uint64_t heartbeatTimestamp = 0;
bool isConnected = false;

/*
 * Primary network. Will try this first
 */
//const char* primarySSID = "SSE Broadband BB1623";
//const char* primaryPassword = "ce9dX6xMc3CT3sTE";
const char* primarySSID = "MelcoNet";
const char* primaryPassword = "freshfish001!";

/*
 * Secondary network. Will try this if connection to primary fails
 */
const char* uniSSID = "iPhone";
const char* uniPassword = "freshfish001!2";

/*
 * Immersive Air server location on heroku
 */
const char* immersiveAirServer = "immersiveair-server.herokuapp.com";
const int immersiveAirServerPort = 80;

/*
 * Purpose: Manage web sockets events
 * Parameters:  
 *    type: Websocket message (ie: Connected or Disconnected) 
 *    payload: The message payload (the message itself)
 *    length: The length of the message in bytes
 * Return:
 *    void
 */
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  
    switch(type) {
      
        /*
         * Immersive Air server has killed us!
         * Flag set to false so know offline
         */
        case WStype_DISCONNECTED:
            USE_SERIAL.printf("Disconnected!\n");
            isConnected = false;            
            break;
       
        /* 
         *  Immersive Air server says Hi!
         *  Flag set to true
         */
        case WStype_CONNECTED:
            {
                USE_SERIAL.printf("Connected to a Immersive Air Server on url: %s\n",  payload);
                isConnected = true;

                /* 
                 * Send message to server when Connected (5)
                 */
                webSocket.sendTXT("5");
            }
            break;

        /*
         * Message from Immersive Air server
         */
        case WStype_TEXT:            
            String messageText = (char*)payload;

            /*
             * .io command 3 is an ACK - Acknowledge Protocol
             */
            if(messageText.startsWith("3")) {            
              USE_SERIAL.println("Got an ACK. Still alive then!\n");

            /*
             * .io 42 is a text message for us - text message arrived over WebSockets from server
             */
            } else if  (messageText.startsWith("42")) {            
             
              /*
               * Send to arduio. Wire potocol
               * Extract the text message from the payload, convert to a binary array and push over wire
               */
              USE_SERIAL.printf("Command received:\n");
              String messageTextJSON = messageText.substring(4, messageText.length() - 1);
              char JSONBuffer[64];
              messageTextJSON.toCharArray(JSONBuffer, messageTextJSON.length());
              USE_SERIAL.printf("JSON sending to Arduino %s\n", JSONBuffer);              
              Wire.beginTransmission(8); 

              /*
               * JSON String is:
               * {
               *  "command": [command number],
               *  "status": [status where 0 if off and 1 is on]
               *  }
               */
              Wire.write(JSONBuffer);  
              Wire.endTransmission();                                  
            }

            break;
    }

}


/*
 * Purpose: ESP8226 startup function
 * Parameters:  
 *    none
 * Return:
 *    void
 */
void setup() {
    USE_SERIAL.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    fromArduino.begin(9600);

    /*
     *  Pause to allow wifi modules and components to intialise
     *  Acts as a spacer
     */
    for(uint8_t t = 4; t > 0; t--) {
      USE_SERIAL.printf("Booting  %d...\n", t);
      USE_SERIAL.flush();
      delay(1000);
    }

    /*
     * Add access point details
     */
    WiFiMulti.addAP(primarySSID, primaryPassword);
    
    /*
     * Adding a second access point details
     */
    WiFiMulti.addAP(uniSSID, uniPassword);   

    /*
     * Connect to one of the access points
     */
    while(WiFiMulti.run() != WL_CONNECTED) {
        USE_SERIAL.println("Connecting to WiFi..hang on a tick...\n");          
        delay(100);
    }   

    /*
     * Connect to Immersive Air server (ws/http, port 80)
     */
    webSocket.beginSocketIO(immersiveAirServer, immersiveAirServerPort);

    /*
     * Register event handle for WebSocket events from server
     * This will get called when a message is received from the Immersive Air server
     */
    webSocket.onEvent(webSocketEvent);

    /*
     * Wire i2c SDA=D1 and SCL=D2 so that we can send commands to Arduino
     */
    Wire.begin(D1, D2); 

}

/*
 * Purpose: ESP8226 processing loop, called every tick
 * Parameters:  
 *    none
 * Return:
 *    void
 */
void loop() {

 // Monitor serial communication
  while(USE_SERIAL.available()) {
    message = USE_SERIAL.readString();
    messageReady = true;
  }
  // Only process message if there's one
  if(messageReady) {
    // The only messages we'll parse will be formatted in JSON
    DynamicJsonDocument doc(1024); // ArduinoJson version 6+
    // Attempt to deserialize the message
    DeserializationError error = deserializeJson(doc,message);
    if(error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      //serializeJson(doc, USE_SERIAL);
      //USE_SERIAL.println("");
      messageReady = false;
      return;
    }
    /*
    if(doc["type"] == "request") {
      doc["type"] = "response";
      // Get data from analog sensors
      doc["distance"] = analogRead(A0);
      doc["gas"] = analogRead(A1);
      serializeJson(doc,Serial);
    }*/
    serializeJson(doc, USE_SERIAL);
    USE_SERIAL.println("");

    //webSocket.sendTXT("42[\"message\", {\"sensor\":\"143\"}]");

     String messagejson = "";
     messagejson = message;
     
     int particle1 = doc["Particles>0.3um"];
     int particle2 = doc["Particles>0.5um"];
     int particle3 = doc["Particles>1.0um"];
     int particle4 = doc["Particles>2.5um"];
     int particle5 = doc["Particles>5.0um"];
     int particle6 = doc["Particles>10.0um"];
     int co2 = doc["C02"];
     int tvoc = doc["TVOC"];
     float temp = doc["Temperature"];
     float humid = doc["Humidity"];

     String sol = String(particle1) + "," + String(particle2) + "," + String(particle3) + "," + 
     String(particle4) + "," + String(particle5) + "," + String(particle6) + "," + String(co2) + "," + 
     String(tvoc) + "," + String(temp) + "," + String(humid);

     webSocket.sendTXT("42[\"message\", \"" + sol + "\"]");
     
     /*
      * TEST CODE END
      */
    
    messageReady = false;
  }
  /*
   * Allow WebSockets to process
   */
    webSocket.loop();

    //webSocket.sendTXT("42\"message\"");

    if(isConnected) {
        uint64_t now = millis();
        
       /*
        * Socket.io handshaking  
        */
        if(now - messageTimestamp > MESSAGE_INTERVAL) {
            /*
             * Let server know we are still here. Don't really need to do this, but good to know
             */
            webSocket.sendTXT("42[\"messageType\",{\"greeting\":\"Immersive Air Here!\"}]");
        }

        /*
         * Socket.io, used on node sever, has some requirements outside of web sockets
         * For starters, it needs this handshake else it will close the connection
         */
        if((now - heartbeatTimestamp) > HEARTBEAT_INTERVAL) {
            heartbeatTimestamp = now;
            /*   
             * Socket.io heartbeat message (just at EVENT 2). We will get a 3 (ACK) back (ping - pong)
             * See https://github.com/socketio/socket.io-protocol
             */
            webSocket.sendTXT("2");
        }
    }

    delay(100);
}
