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
let filtered =[]
callDave(filtered);

//Calls DAVE API, then calls callEric method
function callDave(filtered){
  axios({ method: 'GET', url: apiRoot + 'dave' + queries, timeout: 2000
  }).then(response => { callEric(addToList(filtered, response.data.options, 'dave'));
  })
  .catch(error => {
    console.log('> API for DAVE did not respond or was too slow');
    callEric(filtered);
  })
}
//Calls ERIC API, then calls callJeff method
function callEric(filtered){
  axios({ method: 'GET', url: apiRoot + 'eric' + queries, timeout: 2000
  }).then(response => { callJeff(addToList(filtered, response.data.options, 'eric'));
  })
  .catch(error => {
    console.log('> API for ERIC did not respond or was too slow');
    callJeff(filtered);
  })
}
//Calls JEFF API, then calls accumulate method
function callJeff(filtered){
  axios({ method: 'GET', url: apiRoot + 'jeff' + queries, timeout: 2000
}).then(response => { accumulate(addToList(filtered, response.data.options, 'jeff'));
  })
  .catch(error => {
    console.log('> API for JEFF did not respond or was too slow');
    accumulate(filtered);
  })
}
//Sorts and prints the filtered list of taxi options
function accumulate(filtered){
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
}


//Appends the response from one api call to the filtered list
function addToList(list, response, vendor){
  for(var o in response){ //Loop over options returned for this vendor
    let type = response[o].car_type
    let price = response[o].price
    //Check if this vehicle type is already in the filtered list
    let found = -1;
    for(var i in list){
      if(list[i].type == type){
        found = i;
        break;
      }
    }
    if(found >= 0){ //If entry was already in list
      if(list[found].price > price){ //Overwrite entry if the price is lower
        list[found].type = type;
        list[found].price = price;
        list[found].vendor = vendor;
      }
    } else { //Entry was not in filtered list so add it to list
      list.push({'type':type,'price':price, 'vendor': vendor});
    }
  }
  return list;
}
