const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const User = require("../models/user");

class userController {
  static async getUsers (req, res, next) {
    try {
      const users = await User.find({}, { password: 0 });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      user.password = undefined;
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async login (req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { name: 'EmailPasswordRequired' };

      const userFound = await User.findOne({ email });
      if (!userFound) throw { name: 'EmailPasswordInvalid' };

      const verifiedPassword = comparePassword(password, userFound.password);
      if (!verifiedPassword) throw { name: 'EmailPasswordInvalid' };

      const payload = { id: userFound._id };
      const access_token = createToken(payload);
      
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async updateMembership(req, res, next) {
    try {
      const { id } = req.params;
      const { membership } = req.body;

      const currentUser = await User.findById(id);
      if (!currentUser) throw { name: 'NotFound' };

      currentUser.membership = membership;
      await currentUser.save();

      currentUser.password = undefined;
      res.status(200).json(currentUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
