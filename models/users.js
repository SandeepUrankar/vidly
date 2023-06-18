const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.VIDLY_JWT_SECRET;

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
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, JWT_SECRET, {
    expiresIn: "1 days",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

function validate(user) {
  const userValidator = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    isAdmin: Joi.boolean(),
  });

  const result = userValidator.validate(user);
  return result;
}

module.exports.User = User;
module.exports.validate = validate;
