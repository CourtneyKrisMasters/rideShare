//import models

const { Driver } = require("./models/Driver.js");
const { Location } = require("./models/Location.js");
const { Passenger } = require("./models/Passenger.js");
const { Ride } = require("./models/Ride");
const { State } = require("./models/State.js");
const { Vehicle } = require("./models/Vehicle.js");
const { VehicleType } = require("./models/VehicleType");

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

  // Configure routes.
  server.route([
    {
      method: "GET",
      path: "/vehicleTypes",
      config: {
        description: "Retrieve all vehicle types",
      },
      handler: async (request, h) => {
        return VehicleType.query();
      },
    },

    {
      method: "GET",
      path: "/admin",
      config: {
        description: "Retrieve all current rides",
      },
      handler: async (request, h) => {
        const rideInfo = await Ride.query()
          .select()
          .withGraphFetched("fromlocations.states")
          .withGraphFetched("tolocations.states")
          .withGraphFetched("vehicles")
          .withGraphFetched("passengers")
          .withGraphFetched("drivers");
        return rideInfo;
      },
    },

    {
      //method to add a new vehicle type to the database
      method: "POST",
      path: "/vehicleTypes",
      config: {
        description: "Add a new vehicle type",
        validate: {
          payload: Joi.object({
            vehicleType: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          //check if there is already that type in the database
          const existingType = await VehicleType.query()
            .where("type", request.payload.vehicleType)
            .first();
          if (existingType) {
            return {
              ok: false,
              msge: `Vehicle type '${request.payload.vehicleType}' is already defined`,
            };
          }
          //if there is not already that type in the database, add new type
          const newType = await VehicleType.query().insert({
            type: request.payload.vehicleType,
          });
          //show results
          if (newType) {
            return {
              ok: true,
              msge: `Created type '${request.payload.vehicleType}'`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create vehicle type '${request.payload.vehicleType}'`,
            };
          }
        } catch (e) {
          return {
            ok: false,
            msge:
              `Couldn't create vehicle type '${request.payload.vehicleType}'` +
              e.message,
          };
        }
      },
    },
  ]);
  await server.start();
}

// Go!
init();
