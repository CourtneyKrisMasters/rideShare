const { Model } = require('objection');

class Passenger extends Model {
    static get tableName() {
        return 'Passenger';
    }

    static get idColumn() {
        return 'id';
    }

    
    static get relationMappings() {
        const Ride = require('./Ride');
        return {
            rides: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Passenger.id',
                    through: {
                        //passengers is the join table
                        from: 'Passengers.passengerId',
                        to: 'Passengers.rideId'
                    },
                    to: 'Ride.id'
                }
            }
        }
    }
}
module.exports = { Passenger };

