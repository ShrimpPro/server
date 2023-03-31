const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  pond: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;