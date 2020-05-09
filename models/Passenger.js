const { Model } = require("objection");

class Passenger extends Model {
  static get tableName() {
    return "Passenger";
  }

  static get idColumn() {
    return "id";
  }

  static get relationMappings() {
    return {
      rides: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/Ride",
        join: {
          from: "Passenger.id",
          through: {
            //passengers is the join table
            from: "Passengers.passengerid",
            to: "Passengers.rideid",
          },
          to: "Ride.id",
        },
      },
    };
  }
}
module.exports = { Passenger };
