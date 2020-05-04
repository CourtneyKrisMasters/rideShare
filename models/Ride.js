const { Model } = require('objection');

class Ride extends Model {
    static get tableName() {
        return 'Ride';
    }

    static get idColumn() {
        return 'id';
    }
    
    static get relationMappings() {
        return {
            locations: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'Ride.fromlocationid',
                    to: 'Location.id'
                },
                join :{
                    from: 'Ride.tolocationid',
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
                        from: 'Passengers.rideid',
                        to: 'Passengers.passengerid'
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
                        from: 'Drivers.rideid',
                        to: 'Drivers.driverid'
                    },
                    to: 'Driver.id'
                }
            },

            vehicles: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'Ride.vehicleid',
                    to: 'Vehicle.id'
                },
            }
        }
    }
}

module.exports = { Ride };