![Immersive Air Logo](Thumbnail.png)

# Immersive Air

<br />

[Check out the VR IoT Demo](https://youtu.be/8soYK2LeLBY)

[Check out the Presentation Video](https://youtu.be/AuoXj2qY2LI)

[Check out the Immersive Air Web Application](https://www.immersiveair.co.uk/)

<br />

Contact: mm1716@ic.ac.uk

<br />

## Code Folders

### Alexa
Key Files:
 * Alexa.zip: The zip file for the AWS Lambda developer console. This must be linked as an endpoint to the Alexa Skills Kit Immersive Air skill. For questions on this pipelining process please write @ my contact.
 * index.js: The AWS Lambda function written in Node.js.

 ### Arduino Control
 Key Files:
  * ArduinoControl.ino: The Arduino Mega 2560 file, responsible for sampling the PM2.5, CCS811, and SHT31-D sensors, and transmitting the data as JSON to the NodeMCU module. Code written in Arduino C/C++.

 ### ImmersiveAir-Server
 Key Files:
  * public: Contains the HTML/CSS/JS front-end web application for immersiveair.co.uk.
  * schemas: Contains the Mongoose Schema for the MongoDB Atlas database.
  * mongo.js: Responsible for connecting to the MongoDB Atlas database.
  * server.js: The core Node.js webserver. Responsible for communicating over WebSockets to all 3 actuation platforms (web app, Alexa, Unity VR), aswell as communicating to the OpenWeatherMap API and MongoDB Atlas database. 

 ### SocketClient
 Key Files:
  * SocketClient.ino: The ESP8226 NodeMCU file, responsible for receiving the JSON sensor data from the Arduino Mega and sending it over WebSockets to the Node.js webserver deployed via Heroku. Coded in Lua.
  
<br />

## Additional Comments

 ### Data Repository
 As the data repo was made with MongoDB Atlas a publicly sharable link is not available. An invite has been sent to HH to view the repo. If any further users would like to be added please write @ my contact.

 ### Immersive Air VR Experience
 The project folder can't be pushed to Github due to its size Therefore, the folder is stored via the Box cloud service and can be found at the accessible link: https://imperialcollegelondon.box.com/s/4k3xqo68qd49rf14c4mjqpyzazigzlcm. The setup and pipeline to run this project is outside the scope of this page due to hardware and system specific requiremets. However, for any questions please write @ my contact.
