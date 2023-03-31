const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/mongoConnection');
const { hashPassword } = require('../helpers/bcrypt');

class User {
  static collection() {
    const db = getDatabase();
    const userCollection = db.collection('users');
    return userCollection;
  }

  static async findAll() {
    const users = await this.collection().find().toArray();
    return users.map(el => {
      delete el.password;
      return el;
    });
  }

  static async findOne(id) {
    const user = await this.collection().findOne({ _id: new ObjectId(id) });
    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }

  static async findEmail(email) {
    const user = await this.collection().findOne({ email });
    return user;
  }

  static async create(data) {
    data.password = hashPassword(data.password);
    const createdUser = await this.collection().insertOne(data);
    return createdUser;
  }

  static async delete(id) {
    const deletedUser = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return deletedUser;
  }
}

module.exports = User;