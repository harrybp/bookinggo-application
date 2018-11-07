#!/usr/bin/env node

//Table storing the maximum passengers which can fit in each vehicle
const maxPassengers = {
  'STANDARD': 4,
  'EXECUTIVE': 4,
  'LUXURY': 4,
  'PEOPLE_CARRIER': 6,
  'LUXURY_PEOPLE_CARRIER': 6,
  'MINIBUS': 16
}


//Get arguments
const [,, ... args] = process.argv
let pickup, dropoff, noPassengers;
try {
  if(args.length != 3) throw 'Please enter 3 arguments: pickup, dropoff and number of passengers'
  pickup = args[0].split(',')
  dropoff = args[1].split(',')
  noPassengers = parseInt(args[2])
  if(pickup.length != 2 || dropoff.length != 2) throw 'Coordinates should have 2 parts.'
} catch(err) {
  console.log('Incorrect input: ' + err)
  return
}


//Make request to API
let axios = require('axios');
const apiRoot = 'https://techtest.rideways.com/dave'
let query = apiRoot + '?pickup=' + pickup + '&dropoff=' + dropoff
axios.get(query)
  .then(response => {
    let options = response.data.options;
    //Sort the options by price descending
    options.sort(function(a, b){
      return a.price - b.price;
    })
    let responded = false
    for(var i in options){
      if(maxPassengers[options[i].car_type] >= noPassengers){
        //Only print if vehicle capacity is sufficient
        console.log(options[i].car_type + ' (' + options[i].price + ')')
        responded = true
      }
    }
    //Alert user that API call succeeded but no suitable vehicles were found
    if(!responded) console.log('No suitable vehicles found')
  })
  .catch(error => {
    console.log('API error' + error);
  });
