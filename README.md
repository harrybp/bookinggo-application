# BookingGo Test Submission
# Harry Bond-Preston
## Setup
You will require Node.js to run this submission
Download the repository, navigate to folder and do `npm install` to install dependencies

## Part 1
The answer for part 1 can be found in cli.js. It takes 2 coordinate arguments and an argument for number of passengers and then it queries all three API's and returns the combined results. The results should be ordered by price and should only show the cheapest of each type of taxi.

Part 1 is run as so: `node cli.js <SRC_COORDINATES> <SRC_COORDINATES> <PASSENGER_NO>`

For example: `node cli.js 1,1 2,2 1`

## Part 2
The answer for part 2 is found in app.js. It is essentially the same as part 1 but modified to work as an API using express.

Part 2 is started up as so: `node app.js`

This will start a server on localhost:8080,

To use the API, supply the following query parameters: `pickup`, `dropoff` & `passengers` to `localhost:8080/api`

For example: `http://localhost:8080/api?pickup=1,1&dropoff=2,2&passengers=1`

## Testing
A bash script is provided which runs the CLI with some sample inputs. The output of this can be observed to give a basic level of test coverage. No testing for the api is supplied due to time constraints.
To run this do `./test.sh` from a bash terminal
