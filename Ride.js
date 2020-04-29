const { Model } = require('objection');

class Ride extends Model {
    static get tableName() {
        return 'Ride';
    }

    static get idColumn() {
        return 'id';
    }
    
    static get relationMappings() {
        const Location = require('./Location');
        const Passenger = require('./Passenger');
        const Driver = require('./Driver');
        const Vehicle = require('./Vehicle');
        return {
            locations: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'Ride.fromLocationId',
                    to: 'Location.id'
                },
                join :{
                    from: 'Ride.toLocationId',
                    to: 'Location.id'
                }
            },

            passengers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Passenger",
                join: {
                    from: 'Ride.id',
                    through: {
                        //passengers is the join table
                        from: 'Passengers.rideId',
                        to: 'Passengers.passengerId'
                    },
                    to: 'Passenger.id'
                }
            },

            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Driver",
                join: {
                    from: 'Ride.id',
                    through: {
                        //drivers is the join table
                        from: 'Drivers.rideId',
                        to: 'Drivers.driverId'
                    },
                    to: 'Driver.id'
                }
            },

            vehicles: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'Ride.vehicleId',
                    to: 'Vehicle.id'
                },
            }
        }
    }
}

module.exports = { Ride };