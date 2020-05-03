//import models

const { Driver } = require("./models/Driver.js");
const { Location } = require("./models/Location.js");
const { Passenger } = require("./models/Passenger.js");
const { Ride } = require("./models/Ride.js");
const { State } = require("./models/State.js");
const { Vehicle } = require("./models/Vehicle.js");
const { VehicleType } = require("./models/VehicleType.js");

// Configure Knex.
//We just chose to connect to Julia's personal database - let us know if this is not okay
const knex = require("knex")({
    client: "pg",
    connection: {
        host: 'faraday.cse.taylor.edu',
        user: 'julia_hofmeister',
        password: 'vijivali',
        database: "julia_hofmeister",
        },
    });
    
// Configure Objection.
const { Model } = require("objection");
Model.knex(knex);

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

// Configure routes.
server.route([
    {
        method: "GET",
        path: "/admin",
        config: {
          description: "Retrieve all accounts",
        },
        handler: (request, h) => {
          return Ride.query();
        },
    },
])

// Go!
init();
