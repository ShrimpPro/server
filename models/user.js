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
  role: {
    type: String,
    enum: ['admin', 'partner', 'user'],
    default: 'user'
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