const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
  temp: {
    type: Number,
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  pondId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

module.exports = History;