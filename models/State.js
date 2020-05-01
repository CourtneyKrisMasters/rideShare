const { Model } = require('objection');

class State extends Model {
    static get tableName() {
        return 'State';
    }

    static get idColumn() {
        return 'abbreviation';
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
        return {
            locations: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Location",
                join: {
                    from: 'State.abbreviation',
                    to: 'Location.state'
                }
            }
        }
    }
}
module.exports = { State };