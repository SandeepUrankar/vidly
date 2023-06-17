const Joi = require("joi");
const { mongoose } = require("mongoose");
const { genreSchema } = require("../models/genres");
const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validate(movie) {
  const movieValidator = Joi.object().keys({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().max(0),
    dailyRentalRate: Joi.number().required().max(0),
  });

  const result = movieValidator.validate(movie);
  return result;
}

module.exports.Movie = Movie;
module.exports.validate = validate;
