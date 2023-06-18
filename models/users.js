const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    min: 5,
    max: 50,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    min: 5,
    max: 255,
    required: true,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

function validate(user) {
  const userValidator = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  const result = userValidator.validate(user);
  return result;
}

module.exports.User = User;
module.exports.validate = validate;
