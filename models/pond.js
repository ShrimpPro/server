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
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  histories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'History'
  }],
  harvests: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Harvest'
  }],
}, { timestamps: true });

const Pond = mongoose.model('Pond', pondSchema);

module.exports = Pond;