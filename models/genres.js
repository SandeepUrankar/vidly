const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);

function validate(genre) {
  const genreValidator = Joi.object().keys({
    name: Joi.string().min(3).required(),
  });

  const result = genreValidator.validate(genre);
  return result;
}
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validate;
