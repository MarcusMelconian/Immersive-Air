/*
 * Lambda Function - MM - Final Version - 08/01/21
 * Back end to the Alexa Skills Kit
 */


const http = require('http');
const Alexa = require('ask-sdk');

/*
 * LaunchHandler object - skill invocation
 * Contains two inline functions: canHandle and handle
 * canHandle tests for support confirmation
 * handle calls the response builder to build the Alexa data response out
 */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder
      .speak("Immersive Air Online")
      .reprompt("What would you like to ask him?")
      .getResponse();
  },
};

/*
 * AliveHandler object - custom intent
 * Contains two inline functions: canHandle and handle.
 * canHandle tests for support confirmation
 * handle calls the response builder to build the Alexa data response out
 */
const GetParticleDataHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetParticleData';
  },

  /*
   * Asynchronous, waiting for the http request to be complete before returning
   * Calls http function with Id 1
   */
    async handle(handlerInput) {
        let arrayResponse = []
        let speechOutput = "";

        await httpGet('1')
          .then((response) => {
            arrayResponse = Object.values(response);
            for (i=0; i<arrayResponse.length; i++) {
              speechOutput = speechOutput + arrayResponse[i];
            }
          })
          .catch((err) => {
            speechOutput = err.message
          })

        return handlerInput.responseBuilder
            .speak("There are " + speechOutput + " dust particles in your room")
            .withShouldEndSession(true)
            .getResponse();
    },
};

/*
 * ForwardHandler object - custom intent
 * Contains two inline functions: canHandle and handle.
 * canHandle tests for support confirmation
 * handle calls the response builder to build the Alexa data response out
 */
const GetGasDataHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'GetGasData';
  },

  /*
   * Asynchronous, waiting for the http request to be complete before returning
   * Calls http function with Id 2
   */
  async handle(handlerInput) {
    let arrayResponse = []
    let speechOutput = "";

    await httpGet('2')
      .then((response) => {
        arrayResponse = Object.values(response);
        for (i=0; i<arrayResponse.length; i++) {
          speechOutput = speechOutput + arrayResponse[i];
        }
      })
      .catch((err) => {
        speechOutput = err.message
      })

    return handlerInput.responseBuilder
        .speak("Your CO2 level is " + speechOutput)
        .withShouldEndSession(true)
        .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.standard();

/*
 * Exporting handler objects for node
 */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetParticleDataHandler,
    GetGasDataHandler
  )
  .lambda();

/*
 * Purpose: Makes HTTP GET Request to server with commandId
 * Parameters:
 *    commandId - From specific skill intent
 * Return:
 *    nothing
 */

function httpGet(commandId) {
  return new Promise((resolve, reject) => {
    const options = {
        host: 'immersiveair-server.herokuapp.com',
        port: process.env.PORT || 80,
        path: '/restapi/' + commandId + '/0',
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {

      const body = [];
      res.on('data', (chunk) => body.push(chunk));
      res.on('end', () => resolve(body.join('')));
      //resolve(res);
    });
     
    req.on('error', (e) => {
        reject(e.message);
    });


    req.write('');
    req.end();
  });
};