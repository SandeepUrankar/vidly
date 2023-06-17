const express = require("express");
const router = express.Router();
const { Rental, validate, mongoose } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
// 1. Get all rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(JSON.stringify(rentals));
});

// 2. Create a new rental
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie");
  if (movie.numberInStock === 0)
    return res.status(500).send("Movie not in stock.");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();

  const moview = await Movie.findByIdAndUpdate(
    { _id: movie._id },
    { $inc: { numberInStock: -1 } },
    { new: 1 }
  );
  //   movie.numberInStock--;
  //   movie.save();
  res.send([rental, moview]);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
