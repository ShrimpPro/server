const Pond = require("../models/pond");
const History = require('../models/History');
const Harvest = require('../models/Harvest');
const Device = require("../models/device");

class partnerController {
  static async getPonds (req, res, next) {
    try {
      const pond = await Pond.find()
        .populate('device')
        .populate('histories')
        .populate('harvests');
      res.status(200).json(pond);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = partnerController;