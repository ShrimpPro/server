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

  static async getUserDetail (req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id, { password: 0 })
        .populate('ponds')
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async currentUser (req, res, next) {
    try {
      const { id } = req.user;
      const user = await User.findById(id, { password: 0 })
        .populate('ponds')
      res.status(200).json(user);
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

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, phoneNumber, address, images } = req.body;

      const currentUser = await User.findById(id);
      if(!currentUser) throw { name: 'NotFound' };

      currentUser.name = name;
      currentUser.phoneNumber = phoneNumber;
      currentUser.address = address;
      currentUser.images = images;

      await currentUser.save();

      currentUser.password = undefined;
      res.status(200).json(currentUser);
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

  static async expoToken(req, res, next) {
    try {
      const { id } = req.user;
      const { token } = req.body;
      if (!token) return res.status(400).json({ message: "Token is required !" });

      const currentUser = await User.findById(id);
      if (!currentUser) throw { name: 'NotFound' };
  
      currentUser.expoToken = token;
      await currentUser.save();
  
      currentUser.password = undefined;
      res.status(200).json(currentUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
