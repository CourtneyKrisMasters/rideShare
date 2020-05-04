//import models

const { Driver } = require("./models/Driver.js");
const { Location } = require("./models/Location.js");
const { Passenger } = require("./models/Passenger.js");
const { Ride } = require("./models/Ride");
const { State } = require("./models/State.js");
const { Vehicle } = require("./models/Vehicle.js");
const { VehicleType } = require("./models/VehicleType.js");

// Configure Knex.
// Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu", // PostgreSQL server
    user: "julia_hofmeister", // Your user name
    password: "vijibali", // Your password
    database: "julia_hofmeister", // Your database name
  },
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });
}

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

// Configure routes.
server.route([
    {
        method: "GET",
        path: "/rides",
        config: {
          description: "Retrieve all current rides",
        },
        handler: async (request, h) => {
          const rideInfo = await Ride.query()
          .select("Ride.*", "FromLocation.city AS fromcity", "ToLocation.city AS tocity",
                   "FromState.name AS fromstate", "ToState.name AS tostate", "Vehicle.licensenumber AS vehicleid")
          //how do we do this with the .withGraphFetched?? 
          .innerJoin('Location AS FromLocation', 'Ride.fromlocationid', 'FromLocation.id')
          .innerJoin('Location AS ToLocation', 'Ride.tolocationid', 'ToLocation.id')
          .innerJoin('State AS FromState', 'FromLocation.state', 'FromState.abbreviation')
          .innerJoin('State AS ToState', 'ToLocation.state', 'ToState.abbreviation')
          .innerJoin('Vehicle', 'Ride.vehicleid', 'Vehicle.id')

          //how to we get the first and last names from each passenger and driver after using the .withGraphFetched?
          .withGraphFetched('passengers')
          .withGraphFetched('drivers');
          return rideInfo;
    }
  }
])
await server.start();
}

// Go!
init();
