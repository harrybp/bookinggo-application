#!/usr/bin/env node
let axios = require('axios');

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

//Get arguments
const [,, ... args] = process.argv
let pickup, dropoff, numberOfPassengers;
try {
  if(args.length != 3) throw 'Please enter 3 arguments: pickup, dropoff and number of passengers'
  pickup = args[0].split(',')
  dropoff = args[1].split(',')
  numberOfPassengers = parseInt(args[2])
  if(pickup.length != 2 || dropoff.length != 2) throw 'Coordinates should have 2 parts.'
  if(isNaN(pickup[0]) || isNaN(pickup[1]) || isNaN(dropoff[0]) || isNaN(dropoff[1]))
        throw 'Coordinates should contain numbers only'
} catch(err) {
  console.log('Incorrect input: ' + err)
  return
}

//Make requests to API
callAllAPIs(pickup, dropoff, numberOfPassengers).then(result => { output(result, numberOfPassengers) })

//Sorts, filters and prints the results to command line
function output(results, numberOfPassengers){
  results = results.sort(function(a, b){ //Sort results by price descending
    return a.price - b.price
  })
  let resultFound = false
  for(var i in results){//Loop through and print results
    if(passengerCapacity[results[i].type] >= numberOfPassengers){ //Filter out if capacity not high enough
      console.log(results[i].type + '-' + results[i].vendor + '-' + results[i].price)
      resultFound = true
    }
  }
  if(!resultFound)
    console.log('No suitable vehicles found')
}  

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
      if(error.response) console.log(error.response.data.message + ' (' + error.response.data.path + ')') //Output any error response from API
      else console.log(url.split('?')[0] + ' did not respond or was too slow') //No response
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


