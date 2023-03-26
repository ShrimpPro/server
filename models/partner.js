const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');

class Partner {
  static collection() {
    const db = getDatabase();
    const partnerCollection = db.collection('partners');
    return partnerCollection;
  }


}

module.exports = Partner;