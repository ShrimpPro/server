const IoT = require("../models/iot");

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
}

module.exports = iotController;