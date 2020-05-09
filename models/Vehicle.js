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
                        from: 'Authorization.vehicleid',
                        to: 'Authorization.driverid'
                    },
                    to: 'Driver.id'
                }
            },

            rides: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Vehicle.id',
                    to: 'Ride.vehicleid'
                },
            },

            vehicletypes: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/VehicleType",
                join: {
                    from: 'Vehicle.vehicletypeid',
                    to: 'VehicleType.id'
                }
            },

            //connects to the state table to get the list of all possible state abbreviations
            licenseStates: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/State",
                join: {
                    from: 'Vehicle.licensestate',
                    to: 'State.abbreviation'
                }
            }
        }
    }
}
module.exports = { Vehicle };