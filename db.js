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
        if (request.query.licenseNumber) {
          // Have a query parameter giving a license number; look for that vehicle.
          const vehicle = await Vehicle.query()
            .where("licensenumber", request.query.licenseNumber)
            .first();

          if (vehicle) {
            return {
              ok: true,
              msge: "Vehicle retrieved successfully",
              details: vehicle,
            };
          } else {
            return {
              ok: false,
              msge: `No vehicle with license number '${request.query.licenseNumber}'`,
            };
          }
        }

        // Default (no query parameter): return all vehicles.
        return Vehicle.query();
      },
    },

    //get specific vehicle information, use for update vehicle
    {
      method: "GET",
      path: "/vehicles/{licenseNumber}",
      config: {
        description: "Retrieve the certain vehicle's information",
      },
      handler: async (request, h) => {
        const vehicleLicenseId = request.params.licenseNumber; //do I need this?
        return Vehicles.query().where("licenseNumber", vehicleLicenseId);
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
        // Use `withGraphJoined` so we end up with one big query containing all
        // tables. This make it possible to add `where` clauses later.
        // Note that we are NOT executing the query yet.
        const query = Ride.query()
          .withGraphJoined("[fromlocation, tolocation, vehicle, passengers, drivers]")
          .debug();

        // If there are query parameters in the request, update the Objection query appropriately.
        // This is a little verbose, but it allows the client to filter rides by any or all
        // of these fields.
        if (request.query.licenseNumber) {
          query.where("vehicle.licensenumber", request.query.licenseNumber)
        }
        if (request.query.date) {
          query.where("date", request.query.date)
        }
        if (request.query.time) {
          query.where("time", request.query.time)
        }

        // Finally, actually await the query, causing it to run.
        const result = await query;

        return {
          ok: true,
          details: result,
        };
      },
    },

    
    //get specific ride information, use for ElectToDrive
    {
      method: "GET",
      path: "/drivers/{driverId}",
      config: {
        description:
          "Retrieve the certain ride's information that lines up with the driver's authorization",
      },
      handler: async (request, h) => {
        try {
          // Find the passenger.
          const driver = await Driver.query().findById(
            request.params.driver_id
          );
          //find if driver is already signed up
          const existingRide = await driver
            .$relatedQuery("rides")
            .where("id", request.params.ride_id)
            // .count();
          if (existingRide.length != 0) {
            return {
              ok: false,
              msge: "Already signed up for this ride!",
            };
          }
          const newSignUp = await driver
            .$relatedQuery("rides")
            .relate(request.params.ride_id);

          if (newSignUp) {
            return {
              ok: true,
              msge: "Signed up for this ride!",
            };
          }

        } catch (e) {
          return {
            ok: true,
            msge: e.message,
          };
        }

      }
    },

    {
      method: "POST",
      path: "/passengers/{passenger_id}/rides/{ride_id}",
      config: {
        description:
          "Retrieve the certain ride's information that lines up with the driver's authorization",
      },
      handler: async (request, h) => {
        try {
          // Find the passenger.
          const passenger = await Passenger.query().findById(
            request.params.passenger_id
          );
          //find if passenger is already signed up
          const existingRide = await passenger
            .$relatedQuery("rides")
            .where("id", request.params.ride_id)
          if (existingRide.length != 0) {
            return {
              ok: false,
              msge: "Already signed up for this ride!",
            };
          }
          const newSignUp = await passenger
            .$relatedQuery("rides")
            .relate(request.params.ride_id);

          if (newSignUp) {
            return {
              ok: true,
              msge: "Signed up for this ride!",
            };
          }

        } catch (e) {
          return {
            ok: true,
            msge: e.message,
          };
        }

      }
    },


    //get specific ride information, use for update ride
    {
      method: "GET",
      path: "/rides/{vehicleId}/{date}/{time}", //make sure date doesn't have slashes in it
      config: {
        description: "Retrieve the certain ride's information",
      },
      handler: async (request, h) => {
        return Ride.query()
          .where("vehicleid", request.params.vehicleId)
          .andWhere("date", request.params.date)
          .andWhere("time", request.params.time)
          .first();
      },
    },

    {
      method: "POST",
      path: "/passengers",
      config: {
        description: "Sign up for an passenger account",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const existingAccount = await Passenger.query()
          .where("phone", request.payload.phone)
          .first();
        if (existingAccount) {
          return {
            ok: false,
            msge: `Passenger with phone '${request.payload.phone}' is already in use`,
          };
        }

        const newAccount = await Passenger.query().insert({
          firstname: request.payload.firstName,
          lastname: request.payload.lastName,
          phone: request.payload.phone,
        });

        if (newAccount) {
          return {
            ok: true,
            msge: `Created passenger '${request.payload.phone}'`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create passenger with phone '${request.payload.phone}'`,
          };
        }
      },
    },

    {
      method: "POST",
      path: "/drivers",
      config: {
        description: "Sign up for a driver account",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            phone: Joi.string().required(),
            licenseNumber: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const existingAccount = await Driver.query()
          .where("phone", request.payload.phone)
          .first();
        if (existingAccount) {
          return {
            ok: false,
            msge: `Driver with phone '${request.payload.phone}' is already in use`,
          };
        }

        const newAccount = await Driver.query().insert({
          firstname: request.payload.firstName,
          lastname: request.payload.lastName,
          phone: request.payload.phone,
          licenseNumber: request.payload.licenseNumber,
        });

        if (newAccount) {
          return {
            ok: true,
            msge: `Created Driver '${request.payload.phone}'`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create driver with phone '${request.payload.phone}'`,
          };
        }
      },
    },

    // {
    //   method: "POST",
    //   path: "/drivers",
    //   config: {
    //     description: "Authorize a driver for a ride",
    //     validate: {
    //       payload: Joi.object({
    //         rideId: Joi.number().integer().min(1).required(),
    //         driverId: Joi.number().integer().min(1).required(),
    //       }),
    //     },
    //   },
    //   handler: async (request, h) => {
    //     //find the driver
    //     const driver = await Driver.query().findById(request.payload.driverId);
    //     //find the ride
    //     const ride = await Ride.query().findById(request.payload.rideId);
    //     //relate the two
    //     const affected = await driver.$relatedQuery("rides").relate(ride);
    //     if (affected === 1) {
    //       return {
    //         ok: true,
    //         msge: "Driver successfully authorized for ride",
    //       };
    //     } else {
    //       return {
    //         ok: false,
    //         msge: "Couldn't authorize driver for ride",
    //       };
    //     }
    //   }
    // },

    {
      method: "POST",
      path: "/authorization",
      config: {
        description: "Authorize a driver for a vehicle",
        validate: {
          payload: Joi.object({
            driverId: Joi.number().integer().min(1).required(),
            vehicleId: Joi.number().integer().min(1).required(),
          }),
        },
      },
      handler: async (request, h) => {
        // Find the driver.
        const driver = await Driver.query().findById(request.payload.driverId);
        if (!driver) {
          return {
            ok: false,
            msge: `No driver with ID ${request.payload.driverId}`,
          };
        }
        ``;

        // Find the vehicle.
        const vehicle = await Vehicle.query().findById(
          request.payload.vehicleId
        );
        if (!vehicle) {
          return {
            ok: false,
            msge: `No vehicle with ID ${request.payload.vehicleId}`,
          };
        }

        // Make sure the driver is not already authorized for the vehicle.
        const existingAuth = await driver
          .$relatedQuery("vehicles")
          .where("id", vehicle.id)
          .first();
        if (existingAuth) {
          return {
            ok: false,
            msge: "Driver already authorized for that vehicle",
          };
        }

        // Authorize the driver for the vehicle.
        const affected = await driver.$relatedQuery("vehicles").relate(vehicle);
        if (affected === 1) {
          return {
            ok: true,
            msge: "Driver successfully authorized for vehicle",
          };
        } else {
          return {
            ok: false,
            msge: "Couldn't authorize driver for vehicle",
          };
        }
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
            make: Joi.string().required(),
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
            vehicletypeid: request.payload.vehicleTypeId,
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

    //method to update a certain vehicle
    {
      method: "PATCH",
      path: "/vehicles",
      config: {
        description: "Update the vehicle information",
        validate: {
          payload: Joi.object({
            make: Joi.string().required(),
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
          const updateVehicle = await Vehicle.query()
            .update({
              make: request.payload.make,
              model: request.payload.model,
              color: request.payload.color,
              vehicletypeid: request.payload.vehicleTypeId,
              capacity: request.payload.capacity,
              mpg: request.payload.mpg,
              licensestate: request.payload.licenseState,
            })
            .where("licensenumber", request.payload.licenseNumber);

          if (updateVehicle) {
            return {
              ok: true,
              msge: `Vehicle updated successfully for car license '${request.payload.licenseNumber}'`,
            };
          } else {
            return {
              ok: false,
              msge: "Vehicle not updated",
            };
          }
        } else {
          return {
            ok: false,
            msge: "Invalid license number",
          };
        }
      },
    },

    //method to update a certain ride
    {
      method: "PATCH",
      path: "/rides",
      config: {
        description: "Update a Ride",
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
        const existingRide = await Ride.query()
          .where("vehicleid", request.payload.vehicleId)
          .andWhere("date", request.payload.date)
          .andWhere("time", request.payload.time)
          .first();
        if (existingRide) {
          console.log("The ride had been found");
          const updateRide = await Vehicle.query()
            .update({
              date: request.payload.date,
              time: request.payload.time,
              distance: request.payload.distance,
              fuelprice: request.payload.fuelPrice,
              fee: request.payload.fee,
              vehicleid: request.payload.vehicleId,
              fromlocationid: request.payload.fromLocation,
              tolocationid: request.payload.toLocation,
            })
            .where("licensenumber", request.payload.licenseNumber)
            .andWhere("date", request.payload.date)
            .andWhere("time", request.payload.time);
          //show results
          if (updateRide) {
            return {
              ok: true,
              msge: `Ride updated successfully for car license '${request.payload.licenseNumber}'`,
            };
          } else {
            return {
              ok: false,
              msge: "Ride not updated",
            };
          }
        } else {
          return {
            ok: false,
            msge: "Invalid license number",
          };
        }
      },
    },

    {
      method: "PATCH",
      path: "/locations",
      config: {
        description: "Update a Location",
      },
      handler: async (request, h) => {
        const existingLocation = await Location.query()
          .where("id", request.payload.id)
          .first();
        if (existingLocation) {
          console.log("The location had been found");
          const updateLocation = await Location.query()
            .update({
              //id: request.payload.id,
              name: request.payload.name,
              address: request.payload.address,
              city: request.payload.city,
              state: request.payload.state,
              zipcode: request.payload.zipcode,
            })
            .where("id", request.payload.id);
          //show results
          if (updateLocation) {
            return {
              ok: true,
              msge: `Location updated successfully for location id '${request.payload.id}'`,
            };
          } else {
            return {
              ok: false,
              msge: "Location not updated",
            };
          }
        } else {
          return {
            ok: false,
            msge: "Location not found",
          };
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
        try {
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
              newLocation,
            };
          } else {
            return {
              ok: false,
              msge: `Couldn't create location '${request.payload.name}'`,
            };
          }
        } catch (e) {
          return msge;
        }
      },
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

    //Admin delete a ride from the database
    {
      method: "DELETE",
      path: "/rides/{ride_id}",
      config: {
        description: "Delete a ride from current rides",
      },
      handler: async (request, h) => {
        try {
          // Find the ride.
          const ride = await Ride.query().findById(request.params.ride_id);
          // Unrelate ride from passengers table.
          const deleteRideFromPassengers = await ride
            .$relatedQuery("passengers")
            .where("rideid", request.params.ride_id)
            .unrelate();
          if (deleteRideFromPassengers) {
            return {
              ok: true,
              msge: "Removed ride from Passenger's current rides",
            };
          }
          // Unrelate ride from drivers table.
          const deleteRideFromDrivers = await ride
            .$relatedQuery("drivers")
            .where("rideid", request.params.ride_id)
            .unrelate();
          if (deleteRideFromDrivers) {
            return {
              ok: true,
              msge: "Removed ride from Drivers's current rides",
            };
          }
          // Delete ride from ride table.
          const deleteRide = await ride.delete();
          if (deleteRide) {
            return {
              ok: true,
              msge: "Removed ride from database",
            };
          }
        } catch (e) {
          return {
            ok: true,
            msge: e.message,
          };
        }
      },
    },

    //-------------------These are the passenger routes--------------//
    //Passenger log in
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

    //could use this later to get the fuel prices for each individual?
    // {
    //   method: "GET",
    //   path: "/rides/{id}/fuelPrices",
    //   config: {
    //     description: "Retrieve all current rides fuel prices for this passenger",
    //   },
    //   handler: async (request, h) => {
    //     return Ride.query()
    //       .withGraphFetched("passengers")
    //       .withGraphFetched("drivers")
    //   },
    // },

    //passenger current rides
    {
      method: "GET",
      path: "/passengers/{id}/rides",
      config: {
        description: "Retrieve all current rides for this passenger",
      },
      handler: async (request, h) => {
        try {
          return Passenger.query()
            .where("id", request.params.id)
            .withGraphFetched(
              "rides.[fromlocation, tolocation, vehicle.vehicletypes]"
            )
            .first();
        } catch (e) {
          return request;
        }
      },
    },

    //remove a ride from a passenger's current rides
    {
      method: "DELETE",
      path: "/passengers/{passenger_id}/rides/{ride_id}",
      config: {
        description: "Delete a ride from a passenger's current rides",
      },
      handler: async (request, h) => {
        try {
          // Find the passenger.
          const passenger = await Passenger.query().findById(
            request.params.passenger_id
          );
          // delete the ride
          const deleteRide = await passenger
            .$relatedQuery("rides")
            .where("id", request.params.ride_id)
            .unrelate();
          if (deleteRide) {
            return {
              ok: true,
              msge: "Removed ride from Passenger's current rides",
            };
          }
        } catch (e) {
          return {
            ok: true,
            msge: e.message,
          };
        }
      },
    },

    //-------------------These are the driver routes--------------//

    //Driver log in
    {
      method: "POST",
      path: "/driver",
      config: {
        description: "Driver Log in",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const account = await Driver.query()
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
              licenseNumber: account.licensenumber,
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
    //Driver current rides
    {
      method: "GET",
      path: "/drivers/{id}/drives",
      config: {
        description: "Retrieve all current drives for this driver",
      },
      handler: async (request, h) => {
        try {
          return Driver.query()
            .where("id", request.params.id)
            .withGraphFetched(
              "rides.[fromlocation, tolocation, vehicle.vehicletypes]"
            )
            .first();
        } catch (e) {
          return request;
        }
      },
    },

    //delete a ride from a driver's current drives
    {
      method: "DELETE",
      path: "/drivers/{driver_id}/rides/{ride_id}",
      config: {
        description: "Delete a ride from a driver's current rides",
      },
      handler: async (request, h) => {
        try {
          // Find the passenger.
          const driver = await Driver.query().findById(
            request.params.driver_id
          );
          //delete the ride
          const deleteRide = await driver
            .$relatedQuery("rides")
            .where("id", request.params.ride_id)
            .unrelate();
          if (deleteRide) {
            return {
              ok: true,
              msge: "Removed ride from Passenger's current rides",
            };
          }
        } catch (e) {
          return {
            ok: true,
            msge: e.message,
          };
        }
      },
    },
  ]);
  await server.start();
}

// Go!
init();
