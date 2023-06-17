const Joi = require("joi");
const dbDebugger = require("debug")("app:db");
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => dbDebugger("Connected to DB..."))
  .catch((err) => dbDebugger("Error", err));

const customerSchema = mongoose.Schema({
  isGold: { type: mongoose.Schema.Types.Boolean, default: false },
  name: { type: String, required: true, min: 3, max: 50 },
  phone: { type: Number, max: 99999999999 },
});

const Customer = mongoose.model("Customer", customerSchema);

function validate(customer) {
  const customerValidator = Joi.object().keys({
    name: Joi.string().min(3).required(),
    phone: Joi.number().required().max(9999999999),
  });

  const result = customerValidator.validate(customer);
  return result;
}

module.exports.Customer = Customer;
module.exports.validate = validate;
