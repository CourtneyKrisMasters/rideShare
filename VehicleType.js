const { Model } = require('objection');

class VehicleType extends Model {
    static get tableName() {
        return 'VehicleType';
    }

    static get idColumn() {
        return 'id';
    }
    
    static get relationMappings() {
        const Vehicle = require('./Vehicle');
        return {
            vehicles: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'VehicleType.id',
                    to: 'Vehicle.vehicleTypeId'
                }
            }
        }
    }
}
module.exports = { VehicleType };