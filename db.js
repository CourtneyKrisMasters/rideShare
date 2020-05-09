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

    //get all vehicle types
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
      path: "/vehicles",
      config: {
        description: "Retrieve all vehicles",
      },
      handler: async (request, h) => {
        return Vehicle.query();
      },
    },

    //get all drivers
    {
      method: "GET",
      path: "/drivers",
      config: {
        description: "Retrieve all drivers",
      },
      handler: async (request, h) => {
        return Driver.query();
      },
    },
    
    //get all state information
    {
      method: "GET",
      path: "/states",
      config: {
        description: "Retrieve all states",
      },
      handler: async (request, h) => {
        return State.query();
      },
    },
    
    //get all ride information
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
            vehicleTypeId: Joi.number().required(),
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
          const existingVehicle = await Vehicle.query()
            .where("licensenumber", request.payload.licenseNumber)
            .first();
          if (existingVehicle) {
            return {
              ok: false,
              msge: `Vehicle with '${request.payload.licenseNumber}' license number already exists`,
            };
          }
          //if there is not a vehicle with that license number in the database, add new vehicle
          const newVehicle = await Vehicle.query().insert({
            make: request.payload.make,
            model: request.payload.model,
            color: request.payload.color,
            //need to make sure that the ID is getting put in the database 
            //make sure that when the user selects a type from the dropdown, it's ID gets saved
            vehicletypeid: request.payload.vehicleTypeId,
            capacity: request.payload.capacity,
            mpg: request.payload.mpg,
            //need to make sure that the ID is getting put in the database 
            //make sure that when the user selects a state from the dropdown, it's ID gets saved
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

    {
      method: "PATCH",
      path: "/vehicles",
      config: {
        description: "Update the vehicle information",
        validate: {
          payload: Joi.object({
            make:Joi.string().required(),
            model: Joi.string().required(),
            color: Joi.string().required(),
            vehicleTypeId: Joi.number().required(), 
            capacity: Joi.number().required(),
            mpg: Joi.number().required(),
            licenseState: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const vehicle = await Vehicle.query()
          .where("licensenumber", request.payload.licenseNumber)
          .first();
        if (vehicle) {
          console.log("The vehicle had been found");
          const updateVehicle = await Vehicle.query().update({
            make: request.payload.make,
            model: request.payload.model,
            color: request.payload.color,
            vehicletypeid: request.payload.vehicleTypeId, 
            capacity: request.payload.capacity,
            mpg: request.payload.mpg,
            licensestate: request.payload.licenseState,
            })
            .where("licensenumber", request.payload.licenseNumber)

          if (updateVehicle){
            return {
              ok: true,
              msge: `Vehicle updated successfully for car license '${request.payload.licenseNumber}'`,
            };
          } else {
            return {
              ok: false,
              msge: "Vehicle not updated",
            }
          };
        } else {
          return {
            ok: false,
            msge: "Invalid license number",
          }
        }
      },
    },

    {
      //method to add new locations to the database working
      method: "POST",
      path: "/locations",
      config: {
        description: "Add new Locations",
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        try{
            const newLocation = await Location.query().insert({
              name: request.payload.name,
              address: request.payload.address,
              city: request.payload.city,
              state: request.payload.state,
              zipcode: request.payload.zipcode,
            });
            //show results
            if (newLocation) {
              return {
                ok: true,
                msge: `Created new location '${request.payload.name}'`,
                newLocation
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't create location '${request.payload.name}'`,
              };
            }
           } catch (e){
            return msge;
            }
          }
      },

    {
      //method to add a new Ride to the database
      method: "POST",
      path: "/rides",
      config: {
        description: "Add a new Ride",
        // validate: {
        //   payload: Joi.object({
        //     date:Joi.required(),
        //     time: Joi.required(),
        //     distance: Joi.string().required(),
        //     fuelPrice: Joi.number().required(),
        //     fee: Joi.number().required(),
        //     vehicleId: Joi.number().required(),
        //     fromLocation: Joi.number().required(),
        //     toLocation: Joi.number().required(),
        //   }),
        //},
      },
      handler: async (request, h) => {
        try {
          //check if there is already a ride like this in the database
          //--TODO might need to check this more thoroughly later--//
          const existingRide = await Ride.query()
            .where("vehicleid", request.payload.vehicleId)
            .andWhere("date", request.payload.date)
            .andWhere("time", request.payload.time)
            .first();
          if (existingRide) {
            return {
              ok: false,
              msge: `Ride with '${request.payload.vehicleId}' license number leaving on '${request.payload.date}' at '${request.payload.time}' already exists`,
            };
          }
          //if there is not a vehicle with that license number doing a ride at that time in the database, add new ride
          const newRide = await Ride.query().insert({
            date: request.payload.date,
            time: request.payload.time,
            distance: request.payload.distance,
            fuelprice: request.payload.fuelPrice,
            fee: request.payload.fee,
            vehicleid: request.payload.vehicleId,
            fromlocationid: request.payload.fromLocation,
            tolocationid: request.payload.toLocation,
          });
          //show results
          if (newRide) {
            return {
              ok: true,
              msge: `Created ride!`,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create ride`,
            };
          }
        } catch (e) {
          return {
            ok: false,
            msge:
              `Couldn't create ride with license number '${request.payload.vehicleId}'` +
              e.message,
          };
        }
      },
    },

    //-------------------These are the passenger routes--------------//

    {
      method: "POST",
      path: "/passenger",
      config: {
        description: "Log in",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const account = await Passenger.query()
          .where("firstname", request.payload.firstName)
          .andWhere("lastname", request.payload.lastName)
          .first();
        if (account) {
          return {
            ok: true,
            msge: `Logged in successfully as '${request.payload.firstName}' '${request.payload.lastName}'`,
            details: {
              id: account.id,
              firstName: account.firstname,
              lastName: account.lastname,
              phone: account.phone,
            },
          };
        } else {
          return {
            ok: false,
            msge: "Invalid name",
          };
        }
      },
    },

    {
      method: "GET",
      path: "/rides/{id}/fuelPrices",
      config: {
        description: "Retrieve all current rides fuel prices for this passenger",
      },
      handler: async (request, h) => {
        return Ride.query()
          .withGraphFetched("passengers")
          .withGraphFetched("drivers")
      },
    },

    {
      method: "GET",
      path: "/passengers/{id}/rides",
      config: {
        description: "Retrieve all current rides for this passenger",
      },
      handler: async (request, h) => {
        try{
        return Passenger.query()
          .where("id", request.params.id)
          .withGraphFetched("rides.[fromlocation, tolocation, vehicles.vehicletypes]")
          .first()
        } catch (e){
          return request
        }
      },
    },


  ]);
  await server.start();
}

// Go!
init();
