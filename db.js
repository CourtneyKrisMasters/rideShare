//import models

const { Driver } = require("./Driver.js");
const { Location } = require("./Location.js");
const { Passenger } = require("./Passenger.js");
const { Ride } = require("./Ride.js");
const { State } = require("./State.js");
const { Vehicle } = require("./Vehicle.js");
const { VehicleType } = require("./VehicleType.js");

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
    
<<<<<<< HEAD
    // Configure Objection.
    const { Model } = require("objection");
    Model.knex(knex);

    
    // add and update a vehicle
    
=======
// Configure Objection.
const { Model } = require("objection");
Model.knex(knex);
>>>>>>> 50d2e4aa286b7f2fb49f58f2f4f4b2b691707ee3
