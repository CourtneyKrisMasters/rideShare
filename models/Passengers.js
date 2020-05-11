const { Model } = require("objection");

class Passengers extends Model {
  static get tableName() {
    return "Passengers";
  }

  static get idColumn() {
    return "id";
  }

}
module.exports = { Passengers };
