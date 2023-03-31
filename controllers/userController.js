const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const User = require("../models/user");

class userController {
  static async login (req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { name: 'EmailPasswordRequired' };

      const userFound = await User.findEmail(email);
      if (!userFound) throw { name: 'EmailPasswordInvalid' };

      const verifiedPassword = comparePassword(password, userFound.password);
      if (!verifiedPassword) throw { name: 'EmailPasswordInvalid' };

      const payload = { id: userFound.id };
      const access_token = createToken(payload);

      res.send({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async register (req, res, next) {
    try {
      const { email, password } = req.body;
      const createdUser = await User.create({ email, password, role: 'user' });
      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers (req, res, next) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;