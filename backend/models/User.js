const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false } // Admin flag for backend management
});

// Method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
