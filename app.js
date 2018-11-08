#!/usr/bin/env node
let axios = require('axios');
let express = require('express')
let app = express()
app.set('etag', false); //Prohibits caching

//Table storing the maximum passengers which can fit in each vehicle
const passengerCapacity = {
  'STANDARD': 4,
  'EXECUTIVE': 4,
  'LUXURY': 4,
  'PEOPLE_CARRIER': 6,
  'LUXURY_PEOPLE_CARRIER': 6,
  'MINIBUS': 16
}
const vehicleTypes = ['STANDARD', 'EXECUTIVE', 'LUXURY', 'PEOPLE_CARRIER', 'LUXURY_PEOPLE_CARRIER', 'MINIBUS']
const apis = ['dave', 'eric', 'jeff']
const apiRoot = 'https://techtest.rideways.com/'
const port = 8080
let server = app.listen(port, () => console.log(`App listening on port ${port}!`));

//Executed when api is called
app.get('/api', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let pickup, dropoff;
    try { //Check pickup and dropoff exist and meet requirements
      if(!req.query.pickup) throw 'Please specify pickup'
      if(!req.query.dropoff) throw 'Please specify dropoff'
      pickup = req.query.pickup.split(',')
      dropoff = req.query.dropoff.split(',')
      if(pickup.length != 2 || dropoff.length != 2) throw 'Coordinates should have 2 parts.'
      if(isNaN(pickup[0]) || isNaN(pickup[1]) || isNaN(dropoff[0]) || isNaN(dropoff[1]))
        throw 'Coordinates should contain numbers only'
    } catch(err) { //Output an error message
      let message = 'Incorrect input: ' + err
      let response = {
        'status': 400,
        'error': 'Bad Request',
        'message': message,
      }
      res.status(400).send(response);
      res.end();
      return
    }
    let numberOfPassengers = (!req.query.passengers || isNaN(req.query.passengers))? 1 : req.query.passengers //Default to 1

    callAllAPIs(pickup, dropoff, numberOfPassengers).then(result => {
      res.status(200).send(result);
      res.end();
    }).catch(error => { 
      res.status(400).send(error);
      res.end();
     })
  })


//Calls all API's and returns the accumulated results
async function callAllAPIs(pickup, dropOff, numberOfPassengers){
  let queries = '?pickup=' + pickup + '&dropoff=' + dropOff
  let results = []
  for(var api in apis){
      let response = await callAPI(apiRoot + apis[api] + queries)
      results = addToList(results, response, apis[api])
  }
  return results
}

//Calls one API and returns results
async function callAPI(url){
  return new Promise((resolve, reject) => {
    axios({ //Send get request to api
      method: 'GET', 
      url: url, 
      timeout: 2000
    }).then(response => {
      resolve(response.data.options)
    })
    .catch(error => { //Log error then continue to next api as above
      console.log(url.split('?')[0] + ' did not respond or was too slow')
      resolve([])
    })
  })
}

//Appends the response from one api call to the results list
function addToList(list, response, vendor){
  for(var o in response){ //Loop over options returned for this vendor
    let found = -1 //Check if this vehicle type is already in the results list
    for(var i in list){
      if(list[i].type == response[o].car_type){
        found = i
        break
      }
    }
    if(found == -1) //Entry was not in results list so add it to list
      list.push({'type':response[o].car_type,'price':response[o].price, 'vendor': vendor})
    else if(list[found].price > response[o].price) //If entry was already in list but new price is lower 
      list[found] = {'type':response[o].car_type, 'price':response[o].price, 'vendor': vendor} 
  }
  return list
}


