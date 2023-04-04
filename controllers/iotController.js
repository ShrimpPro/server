const History = require("../models/history");
const IoT = require("../models/iot");
const Pond = require("../models/pond");
const { Expo } = require("expo-server-sdk");
const User = require("../models/user");
const expo = new Expo();

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

      if (currentPond.pH >= 8 || currentPond.pH <= 6.5) {
        console.log(currentPond.pH, '<<<<<<<<<<< pH');
        const currentUser = await User.findById(currentPond.userId);

        if (!Expo.isExpoPushToken(currentUser.expoToken)) {
          return res.status(400).json({ message: `Invalid token !` });
        }
    
        const chunks = expo.chunkPushNotifications([
          {
            to: currentUser.expoToken,
            body: 'Kadar pH dalam status bahaya, silahkan periksa kolam',
            title: 'Bahaya',
          },
        ]);

        await expo.sendPushNotificationsAsync(chunks[0])
      } else if (currentPond.temp >= 30 || currentPond.temp <= 25) {
        console.log(currentPond.temp, '<<<<<<<<<<< temp');
        const currentUser = await User.findById(currentPond.userId);

        if (!Expo.isExpoPushToken(currentUser.expoToken)) {
          return res.status(400).json({ message: `Invalid token !` });
        }
    
        const chunks = expo.chunkPushNotifications([
          {
            to: currentUser.expoToken,
            body: 'Temperatur air dalam status bahaya, silahkan periksa kolam',
            title: 'Bahaya',
          },
        ]);

        await expo.sendPushNotificationsAsync(chunks[0])
      }

      res.status(201).json({ pond: currentPond });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = iotController;