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
    enum: ['basic', 'premium', null],
    default: null
  },
  ponds: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Pond'
  }]
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = hashPassword(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;