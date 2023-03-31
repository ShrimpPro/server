const mongoose = require('mongoose');
const { Schema } = mongoose;

const harvestSchema = new Schema({
  capital: {
    type: Number,
    required: true
  },
  earning: {
    type: Number,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  pondId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }
}, { timestamps: true });

const Harvest = mongoose.model('Harvest', harvestSchema);

module.exports = Harvest;