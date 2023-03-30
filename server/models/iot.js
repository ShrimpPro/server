const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class IoT {
  static collection() {
    const db = getDatabase();
    const iotCollection = db.collection('iot');
    return iotCollection;
  }


}

module.exports = IoT;