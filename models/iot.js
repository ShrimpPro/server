const database = require("../config/firebase");
const { ref, get } = require("firebase/database");

class IoT {
  static async findAll() {
    const dataRef = ref(database);
    try {
      const snapshot = await get(dataRef);
      const data = snapshot.val();
      return data;
    } catch (error) {
      throw new Error('The read failed: ' + error.code);
    }
  }

  static async findById(id) {
    const dataRef = ref(database, `${id}/`);
    try {
      const snapshot = await get(dataRef);
      const data = snapshot.val();
      return data;
    } catch (error) {
      throw new Error('The read failed: ' + error.code);
    }
  }
}

module.exports = IoT;