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
