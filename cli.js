#!/usr/bin/env node

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


//Make requests to API
let axios = require('axios');
const apiRoot = 'https://techtest.rideways.com/'
let queries = '?pickup=' + pickup + '&dropoff=' + dropoff
axios.all([
  //Make a request for each supplier
  axios.get(apiRoot + 'dave' + queries),
  axios.get(apiRoot + 'eric' + queries),
  axios.get(apiRoot + 'jeff' + queries)
])
  .then(response => {
    let vendors = ['dave', 'eric', 'jeff']
    var filtered = []; //Filter the responses so only the cheapest for each vehicle type remains
    for(var v in vendors){ //Loop over dave,eric,jeff
      let options = response[v].data.options;
      for(var o in options){ //Loop over options returned for this vendor
        let type = options[o].car_type
        let price = options[o].price
        //Check if this vehicle type is already in the filtered list
        let found = -1;
        for(var i in filtered){
          if(filtered[i].type == type){
            found = i;
            break;
          }
        }
        if(found >= 0){ //If entry was already in list
          if(filtered[found].price > price){ //Overwrite entry if the price is lower
            filtered[found].type = type;
            filtered[found].price = price;
            filtered[found].vendor = vendors[v];
          }
        } else { //Entry was not in filtered list so add it to list
          filtered.push({'type':type,'price':price, 'vendor': vendors[v]});
        }
      }
    }
    filtered.sort(function(a, b){
      return a.price - b.price;
    })
    for(var i in filtered){
      if(passengerCapacity[filtered[i].type] >= noPassengers){
        //Only print if vehicle capacity is sufficient
        console.log(filtered[i].type + '-' + filtered[i].vendor + '-' + filtered[i].price)
        responded = true
      }
    }
    if(!responded) console.log('No suitable vehicles found')
  })
  .catch(error => {
    console.log('API error, please try again (' + error + ')');
  });
