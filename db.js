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