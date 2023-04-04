const mongoose = require('mongoose');
const { hashPassword } = require('../helpers/bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email and Password is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Email and Password is required']
  },
  membership: {
    type: String,
    enum: ['PREMIUM', 'BASIC', null],
    default: null
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  images: [{
    type: String
  }],
  ponds: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }],
  expoToken: {
    type: String
  },
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = hashPassword(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;