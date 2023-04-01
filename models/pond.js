const mongoose = require('mongoose');
const { Schema } = mongoose;

const pondSchema = new Schema({
  device: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Device',
    required: true
  },
  temp: {
    type: Number,
    default: null
  },
  ph: {
    type: Number,
    default: null
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  histories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'History',
    default: []
  }],
  harvests: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Harvest',
    default: []
  }],
}, { timestamps: true });

const Pond = mongoose.model('Pond', pondSchema);

module.exports = Pond;