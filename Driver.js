const { Model } = require('objection');

class Driver extends Model {
    static get tableName() {
        return 'Driver';
    }

    static get idColumn() {
        return 'id';
    }

    
    static get relationMappings() {
        const Ride = require('./Ride');
        const Vehicle = require('./Vehicle');
        return {
            rides: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Driver.id',
                    through: {
                        //drivers is the join table
                        from: 'Drivers.driverId',
                        to: 'Drivers.rideId'
                    },
                    to: 'Ride.id'
                }
            },

            vehicles: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'Driver.id',
                    through: {
                        //authorization is the join table
                        from: 'Authorization.driverId',
                        to: 'Authorization.vehicleId'
                    },
                    to: 'Vehicle.id'
                }
            }
        }
    }
}
module.exports = { Driver };

