const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
  temp: {
    type: Number
  },
  pH: {
    type: Number
  },
  pondId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }
}, { timestamps: true });

const History = mongoose.model('History', historySchema);

module.exports = History;