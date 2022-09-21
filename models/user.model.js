const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('users', userSchema);

module.exports = { User };
