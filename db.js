const { Driver } = require("./Driver");
const { Location } = require("./Location");
const { Passenger } = require("./Passenger");
const { Ride } = require("./Ride");
const { rideShare } = require("./rideShare");
const { State } = require("./State");
const { Vehicle } = require("./Vehicle");
const { VehicleType } = require("./VehicleType");

// Configure Knex.
const knex = require("knex")({
    client: "pg",
    connection: {
    host: 'faraday.cse.taylor.edu',
    user: 'readonly',
    password: 'vijivali',
    database: "julia_hofmeister",
    },
    });
    
    // Configure Objection.
    const { Model } = require("objection");
    Model.knex(knex);