const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genres");
// 1. Get all genre
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(JSON.stringify(genres));
});

// 2. Create a new genre
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

// 3. Update a genre
router.put("/:id", async (req, res) => {
  // Validate Input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(400).send(`Genre with ${req.params.id} doesn't exists.`);
  res.send(JSON.stringify(genre));
});

// 4. Delete a genre
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res
      .status(400)
      .send(`Genre with id=${req.params.id} doesn't exists.`);
  res.send(genre);
});

module.exports = router;
