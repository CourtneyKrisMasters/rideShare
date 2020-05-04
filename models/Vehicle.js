const { Model } = require('objection');

class Vehicle extends Model {
    static get tableName() {
        return 'Vehicle';
    }

    static get idColumn() {
        return 'id';
    }

    
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Driver",
                join: {
                    from: 'Vehicle.id',
                    through: {
                        //authorization is the join table
                        from: 'Authorization.vehicleId',
                        to: 'Authorization.driverId'
                    },
                    to: 'Driver.id'
                }
            },

            rides: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Vehicle.id',
                    to: 'Ride.vehicleId'
                },
            },

            vehicle_types: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Vehicle_Type",
                join: {
                    from: 'Vehicle.vehicleTypeId',
                    to: 'Vehicle_type.id'
                }
            },

            //connects to the state table to get the list of all possible state abbreviations
            licenseStates: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/State",
                join: {
                    from: 'Vehicle.licenseState',
                    to: 'State.abbreviation'
                }
            }
        }
    }
}
module.exports = { Vehicle };