![Immersive Air Logo](Thumbnail.png)

# Immersive Air

## Educating Air Pollution through Immersive IoT

[Check out the VR IoT Demo](https://youtu.be/8soYK2LeLBY)

[Check out the Presentation Video](https://youtu.be/AuoXj2qY2LI)

[Check out the Immersive Air Web Application](https://www.immersiveair.co.uk/)

<br />

# The 4 code folders will be explained below.

<br />

## Alexa
Key Files:
 * Alexa.zip: The zip file for the AWS Lambda developer console. This must be linked as an endpoint to the Alexa Skills Kit Immersive Air skill. For questions on this pipelining process please write @ my contact.
 * index.js: The AWS Lambda function written in Node.js.
 
<br />

 ## Arduino Control
 Key Files:
  * ArduinoControl.ino: The Arduino Mega 2560 file, responsible for sampling the PM2.5, CCS811, and SHT31-D sensors, and transmitting the data as JSON to the NodeMCU module. Code written in Arduino C/C++.
  
<br />

 ## ImmersiveAir-Server
 Key Files:
  * public: Contains the HTML/CSS/JS front-end web application for immersiveair.co.uk.
  * schemas: Contains the Mongoose Schema for MongoDB Atlas database.
  * mongo.js: Responsible for connecting to the MongoDB Atlas database.
  * server.js: The core Node.js webserver. Responsible for communicating over WebSockets to all 3 actuation platforms (web app, Alexa, Unity VR), aswell as talking to the OpenWeatherMap API and MongoDB Atlas database. 
  
<br />

 ## SocketClient
 Key Files:
  * SocketClient.ino: The ESP8226 NodeMCU file, responsible for received the JSON sensor data from the Arduino Mega and sending it over WebSockets to the Node.js webserver deployed via Heroku. Coded in Lua.
  
<br />

# Additional comments are made below.

<br />

 ## Data Repository
 As the data repo was made with MongoDB Atlas a publicly sharable link is not available. An invite has been sent to HH to view the repo. If any other users would like to be added please write @ my contact.
 
<br />

 ## Immersive Air VR Experience
 The project folder can not be pushed to Github due to its size. The folder is stored via the Box cloud service. If you would like to be added to via the Unity project please write @ my contact.
