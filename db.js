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
      path: "/rides",
      config: {
        description: "Retrieve all current rides",
      },
      handler: async (request, h) => {
        return Ride.query()
          .withGraphFetched("fromlocation")
          .withGraphFetched("tolocation")
          .withGraphFetched("vehicles")
          .withGraphFetched("passengers")
          .withGraphFetched("drivers");
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
          const newVehicle = await VehicleType.query().insert({
            type: request.payload.vehicleType,
          });
          //show results
          if (newVehicle) {
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

    {
      //method to add a new Vehicle to the database
      method: "POST",
      path: "/vehicles",
      config: {
        description: "Add a new vehicle",
        validate: {
          payload: Joi.object({
            make:Joi.string().required(),
            model: Joi.string().required(),
            color: Joi.string().required(),
            vehicleType: Joi.string().required(),
            capacity: Joi.number().required(),
            mpg: Joi.number().required(),
            licenseState: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          //check if there is already that type in the database
          const existingType = await VehicleType.query()
            .where("licensenumber", request.payload.licenseNumber)
            .first();
          if (existingType) {
            return {
              ok: false,
              msge: `Vehicle with '${request.payload.vehicleType}' license number already exists`,
            };
          }
          //if there is not already that type in the database, add new type
          const newVehicle = await Vehicle.query().insert({
            make: request.payload.make,
            model: request.payload.model,
            color: request.payload.color,
            //need to make sure that the ID is getting put in the database 
            //make sure that when the user selects a type from the dropdown, it's ID gets saved
            vehicletypeid: request.payload.vehicleType,
            capacity: request.payload.capacity,
            mpg: request.payload.mpg,
            licensestate: request.payload.licenseState,
            licensenumber: request.payload.licenseNumber,
          });
          //show results
          if (newVehicle) {
            return {
              ok: true,
              msge: `Created vehicle with license number '${request.payload.licenseNumber}'`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create vehicle with license number '${request.payload.licenseNumber}'`,
            };
          }
        } catch (e) {
          return {
            ok: false,
            msge:
              `Couldn't create vehicle with license number '${request.payload.licenseNumber}'` +
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
