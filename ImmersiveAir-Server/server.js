/*
 * Immersive Air Heroku Server - MM - 22/11/20
 * Send messages over Sockets to any connected device
 */

 /*
  * Use express, for quicker dev
  */
 const express = require('express');
 
 /*
  * This app
  */
 const app = express();
 
 /* 
  * Our path
  */
 var path = require('path');
 
 /*
  * Var for socket.io
  */
 var io;

 /*
  * MongoDB
  */
 const mongo = require('./mongo');
 const sensorSchema = require('./schemas/sensor-schema');

 /*
  * Openweathermap API URL
  */
 const url = "https://api.openweathermap.org/data/2.5/weather?q=Kingswood&appid=3d2821a1a6e541e7df72736a90e94ce0";

 /*
  * Axios for API calls
  */
 const axios = require('axios');

 /*
  * Node-correlation
  */
 const Correlation = require('node-correlation');
 
 /*
  * Enable CORS
  */
 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });

 /*
  * This is the structure returned by the server in response to REST API calls.
  */
 var responseStructure = {
   "immersiveair" : {
      "status" : ""
   }
 }


 /*
  * Set static folder
  */
 app.use(express.static(path.join(__dirname, 'public')));
 

 /* 
  * Start server - calling the node app.listen function, registering the inline callback function
  */
 const server = app.listen(process.env.PORT || 80, function() {
   console.log('Immersive Air socket, REST and site server listening at: ' + server.address().port + " " + server.address().address);
  });


  /*
   * Bind sockets.io to server (hybrid version of websockets, not pure)
   */
  io = require('socket.io')(server);


  /*
   * Create namespace for JS webpage
   */
  io2 = io.of('/webpage');

  
  /*
   * Create namespace for Unity
   */
  io3 = io.of('/unity');


  var active = false;
  var active2 = false;
  var activeDataPoints;
  var activeTimescale;
  var activeDirector;

  // For Unity
  var currentItem;


  /*
   * Log JS socket connection
   */
  io2.on('connection', async (socket) => {

    active = true;

    /*
     * Send data to JS client upon socket connection
     */
    const mongoDBStartup = async (dataPoints = 20, timescale = 1, startup = false) => {
      await mongo().then(async (mongoose) => {
        try {
          console.log('Initialise Mongo Startup!');
          await sensorSchema.find({}, (err, data) => {
            if (startup) {
              socket.emit('startup-data', data);
            }
            else {
              socket.emit('request-data', data);
            }
          }).sort({ $natural: -1}).limit(dataPoints*timescale);
        } finally {
          console.log('Startup Complete!');
          if(!active2) { mongoose.connection.close(); }
          active = false;
        }
      })
    }


    /*
     * Startup Data Request from JS client HOME
     */
    socket.on('startup-data', (data) => {
      mongoDBStartup(data.dataPoints, 1, data.startup);
    })


    /*
     * Data Request from JS client HOME
     */
    socket.on('request-data', (data) => {

      active = true;
      mongoDBStartup(data.dataPoints, data.timescale);

    })


    /*
     * Send data to JS client for Correlation
     */
    const mongoDBCorrelation = async (dataPoints = 20, timescale = 360) => {
      await mongo().then(async (mongoose) => {
        try {
          console.log('Correlation Startup!');
            await sensorSchema.find({}, (err, data) => {
              socket.emit('request-correlation-data', data);
            }).sort({ $natural: -1}).limit(dataPoints*timescale);
        } finally {
          console.log('Correlation Complete!');
          if(!active2) { mongoose.connection.close(); }
          active = false;
        }
      })
    }


    /*
     * Calculate correlations and send result to JS client
     */
    const findCorrelations = async (data, dataPoints, timescale, director) => {
      console.log(data.length);
      var correlationArray = [[],[],[],[],[],[],[],[],[],[],[],[]];
      var namesArray = ['particle1', 'particle2', 'particle3', 'particle4', 'particle5', 'particle6', 'co2', 'tvoc', 'temp', 'templocal', 'humid', 'humidlocal', 'time'];

      const index = namesArray.indexOf(director);
      namesArray.splice(index, 1);

      data = data.reverse();
      var difference = (data.length)-(dataPoints*timescale);
      if (difference < 0 ) { difference = 0;}

      for (let h=0; h<11; h++) {

        for (let i=difference; i<data.length; i+=timescale) {
       
          var temp = data.slice(i, i+timescale);
          var temp1 = [];
          var temp2 = [];
          for (let j=0; j<temp.length; j++) { 
            if (temp[j][director]['$numberDecimal']) {
              temp1.push(parseFloat(temp[j][director]['$numberDecimal']));
            }
            else { temp1.push(temp[j][director]); }
          }
          for (let j=0; j<temp.length; j++) { 
            if (temp[j][namesArray[h]]['$numberDecimal']) {
              temp2.push(parseFloat(temp[j][namesArray[h]]['$numberDecimal']));
            }
            else { temp2.push(temp[j][namesArray[h]]); }
          }

          var correlation = Correlation.calc(temp1, temp2);
          if (isNaN(correlation)) { correlationArray[h].push(0);}
          else { correlationArray[h].push(correlation); }

          //correlationArray[h].push(Correlation.calc(temp1, temp2));

          if (h == 0) { correlationArray[11].push(temp[0]['time']); }
          
        }

      }

      socket.emit('perform-correlation-data', correlationArray);
    } 


     /*
     * Data Request from JS client CORRELATION
     */
    socket.on('request-correlation-data', (data) => {

      active = true;
      activeDataPoints = data.dataPoints
      activeTimescale = data.timescale;
      activeDirector = data.director;
      mongoDBCorrelation(data.dataPoints, data.timescale);

    })


      /*
     * Data Performance from JS client CORRELATION
     */
    socket.on('perform-correlation-data', (data) => {

      if (data.length == 2) {
        activeDataPoints = data[0].dataPoints;
        activeTimescale = data[0].timescale;
        activeDirector = data[0].director;
        findCorrelations(data[1], activeDataPoints, activeTimescale, activeDirector);
      }
      else { findCorrelations(data, activeDataPoints, activeTimescale, activeDirector); }

    })
    

  });


  /*
  * Log ESP8226 socket connection
  */
  io.of('/').on('connection', async (socket) => {
    console.log('New connection: ' + socket.id);

    /* 
    * Receive data from ESP8226 Socket Client
    */
    socket.on('message', (data) => {

      // Covert incoming data to int array
      var dataArray = data.split(',').map(function(data){return Number(data);});

      active2 = true;

      // Send data to mongoDB Atlas
      const mongoDBDataStore = async () => {
      await mongo().then(async (mongoose) => {
        try {
          console.log('Connected to mongodb!')

          // Get Time for Data
          const timeElapsed = Date.now();
          const today = new Date(timeElapsed);
          var time = today.toUTCString();

          // Get OpenWeather API Data
          const response = await axios.get(url)

          // Create object for storage
          const item = {
            particle1: dataArray[0],
            particle2: dataArray[1],
            particle3: dataArray[2],
            particle4: dataArray[3],
            particle5: dataArray[4],
            particle6: dataArray[5],
            co2: dataArray[6],
            tvoc: dataArray[7],
            temp: dataArray[8],
            templocal: parseFloat((response.data.main.feels_like - 273.15).toFixed(2)),
            humid: dataArray[9],
            humidlocal: response.data.main.humidity,
            time: time
          }

          await new sensorSchema(item).save()

          currentItem = item;

          /* Emit socket.io to client web app */
          if (!active) { io2.emit('sensor-data', item); }

          /* Emit socket.io to unity */
          io3.emit('unity-data', item); 
    
        } finally {
          console.log('Data stored to mongodb!')
          if (!active) { mongoose.connection.close(); }
          active2 = false;
        }
      })
    }
    
    mongoDBDataStore()

    });

  });


  /*
  * Log Unity connection
  */
  io3.on('connection', async (socket) => { 

    socket.on("unity-start", (data) => {
      socket.emit("unity-data", currentItem);
    });

  });


 /*
  * REST API that will be called by React
  * Format is restapi/x/y where x is command id and y is status
  * Status may not be needed - but gives extra data channel
  */
 app.get('/restapi/:commandid/:commandstatus', function (req, res) {
   console.log('Recieved command over rest: ' + req.params.commandid + " with status " + req.params.commandstatus);
   

    if (req.params.commandid == 1) {
      res.send(currentItem.particle1.toString());
    }

    if (req.params.commandid == 2) {
      res.send(currentItem.co2.toString() + " parts per million" + " and your T V O C level is " + currentItem.tvoc.toString() + " parts per billion");
    }
 
 })

 
 /*
  * Just a welcome and test static page.
  */
 app.get('/', function(req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
 });