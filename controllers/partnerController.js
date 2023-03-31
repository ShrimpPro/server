const Pond = require("../models/pond");
const History = require('../models/History');
const Harvest = require('../models/Harvest');
const Device = require("../models/device");

class partnerController {
  static async getPonds (req, res, next) {
    try {
      const ponds = await Pond.find()
        .populate('device')
        .populate('histories')
        .populate('harvests');
      res.status(200).json(ponds);
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