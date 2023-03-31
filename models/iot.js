const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class IoT {
  static collection() {
    const db = getDatabase();
    const iotCollection = db.collection('ponds');
    return iotCollection;
  }


}

module.exports = IoT;