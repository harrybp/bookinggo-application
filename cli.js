#!/usr/bin/env node

//Get arguments
const [,, ... args] = process.argv
let pickup, dropoff;
try {
  if(args.length != 2) throw 'Please enter 2 arguments: pickup and dropoff'
  pickup = args[0].split(',')
  dropoff = args[1].split(',')
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
    options.sort(function(a, b){
      return a.price - b.price;
    })
    for(var i in options){
      console.log(options[i].car_type + ' (' + options[i].price + ')')
    }
  })
  .catch(error => {
    console.log('API error');
  });
