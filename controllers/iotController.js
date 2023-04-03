const History = require("../models/history");
const IoT = require("../models/iot");
const Pond = require("../models/pond");

class iotController {
  static async getAllDevices (req, res, next) {
    try {
      const devices = await IoT.findAll();
      res.status(200).json(devices);
    } catch (error) {
      next(error);
    }
  }

  static async findDevice (req, res, next) {
    try {
      const { pondId } = req.params;
      const device = await IoT.findById(pondId);
      res.status(200).json(device);
    } catch (error) {
      next(error);
    }
  }

  static async periodicUpdate (req, res, next) {
    try {
      const { pondId } = req.params;
      const { pH, temp } = req.body;

      const currentPond = await Pond.findById(pondId);
      if (!currentPond) throw { name: 'NotFound' };

      const createdHistory = await History.create({
        temp: currentPond.temp,
        pH: currentPond.pH,
        pondId: currentPond._id
      });

      currentPond.histories.push(createdHistory._id);
      currentPond.pH = pH;
      currentPond.temp = temp;

      await currentPond.save();

      res.status(201).json({ pond: currentPond });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = iotController;