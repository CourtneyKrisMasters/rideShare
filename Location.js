const { Model } = require('objection');

class Location extends Model {
    static get tableName() {
        return 'Location';
    }

    static get idColumn() {
        return 'id';
    }
/*
    static get jsonSchema() {
        return {
            type: 'string',
            required: 'state'


        }
    }
    */
    
    static get relationMappings() {
        const State = require('./State');
        const Ride = require('./Ride');
        return {
            states: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/State",
                join: {
                    from: 'Location.state',
                    to: 'State.abbreviation'
                }
            },

            rides: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'Location.id',
                    to: 'Ride.fromLocationId'
                },
                join :{
                    from: 'Location.id',
                    to: 'Ride.toLocationId'
                }
            }
        }
    }
}

module.exports = { Location };