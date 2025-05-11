// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchedVideos: { type: Number, default: 0 },
  solvedTasks:   { type: Number, default: 0 },
  points:        { type: Number, default: 0 },
  level:         { type: Number, default: 1 }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);


