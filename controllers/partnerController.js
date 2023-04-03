const Pond = require("../models/pond");
const History = require('../models/history');
const Harvest = require('../models/harvest');
const Device = require("../models/device");
const User = require("../models/user");

class partnerController {
  static async getPonds (req, res, next) {
    try {
      const ponds = await Pond.find({ userId: req.user.id })
        .populate('device')
        .populate({
          path: 'histories',
          options: {
              sort: { createdAt: -1 },
              limit: 7
          }
        })
        .populate('harvests');
      res.status(200).json(ponds);
    } catch (error) {
      next(error);
    }
  }

  static async getPondDetail (req, res, next) {
    try {
      const { id } = req.params;
      const pond = await Pond.findById(id)
        .populate('device')
        .populate({
          path: 'histories',
          options: {
            sort: { createdAt: -1 },
            limit: 7
          }
        })
        .populate('harvests');
      res.status(200).json(pond);
    } catch (error) {
      next(error);
    }
  }

  static async addDeviceAndPond(req, res, next) {
    try {
      const { id } = req.user;
      
      const currentUser = await User.findById(id);
      if (!currentUser.membership) throw { name: 'NoMembership' }
      if (currentUser.membership === 'basic' && currentUser.ponds.length === 1) throw { name: 'MaximumLimit' }
      
      const { name } = await Device.findOne().sort({$natural:-1});
      const newName = `device-${Number(name.split('-')[1]) + 1}`;
      const createdDevice = await Device.create({
        name: newName,
        type: 'esp32',
        detail: 'alat sensor pengukur ph dan temperatur'
      });

      const createdPond = await Pond.create({
        userId: id,
        device: createdDevice._id
      });

      createdDevice.pond = createdPond._id;
      await createdDevice.save();

      currentUser.ponds.push(createdPond._id);
      await currentUser.save();

      res.status(201).json({ device: createdDevice, pond: createdPond });
    } catch (error) {
      next(error);
    }
  }

  static async addHarvest(req, res, next) {
    try {
      const { pondId } = req.params;
      const { capital, earning, quality, description } = req.body;

      const currentPond = await Pond.findById(pondId);
      if (!currentPond) throw { name: 'NotFound' };

      const createdHarvest = await Harvest.create({ capital, earning, quality, description, pondId });
      currentPond.harvests.push(createdHarvest._id);
      await currentPond.save();

      res.status(201).json(createdHarvest);
    } catch (error) {
      next(error);
    }
  }

  static async getHarvests(req, res, next) {
    try {
      const harvests = await Harvest.find();
      res.status(200).json(harvests);
    } catch (error) {
      console.log(error, '<<<<<<<<<<')
      next(error);
    }
  }

  static async findHarvest(req, res, next) {
    try {
      const { id } = req.params;
      const harvest = await Harvest.findById(id);
      if (!harvest) throw { name: 'NotFound' };
      res.status(200).json(harvest);
    } catch (error) {
      next(error);
    }
  }

  static async updateHarvest(req, res, next) {
    try {
      const { id } = req.params;
      const { capital, earning, quality, description } = req.body;
  
      const currentHarvest = await Harvest.findById(id);
      if (!currentHarvest) throw { name: 'NotFound' };

      currentHarvest.capital = capital;
      currentHarvest.earning = earning;
      currentHarvest.quality = quality;
      currentHarvest.description = description;

      const updatedHarvest = await currentHarvest.save();

      res.status(200).json(updatedHarvest);
    } catch (error) {
      next(error);
    }
  }

  static async deleteHarvest(req, res, next) {
    try {
      const { id } = req.params;
      const response = await Harvest.deleteOne({ _id: id });
      if (response.deletedCount === 0) throw { name: 'NotFound' };
      res.status(200).json({ message: 'Harvest removed' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = partnerController;