const express = require("express");
const router = express.Router();
const Joi = require("joi");

let genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Sci-fi" },
  { id: 4, name: "Horror" },
];

// 1. Get all genre
router.get("/", (req, res) => {
  res.send(JSON.stringify(genres));
});

// 2. Create a new genre
router.post("/", (req, res) => {
  const { error } = validateInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);

  res.send(genre);
});

// 3. Update a genre
router.put("/:id", (req, res) => {
  // Fetch the genre.
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(400).send(`Genre with ${re.params.id} doesn't exists.`);

  // Validate Input
  const { error } = validateInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update the name
  genre.name = req.body.name;
  res.send(genre);
});

// 4. Delete a genre
router.delete("/:id", (req, res) => {
  // Fetch the genre.
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res
      .status(400)
      .send(`Genre with id=${req.params.id} doesn't exists.`);

  const i = genres.indexOf(genre);
  genres.splice(i, 1);
  res.send(genre);
});

function validateInput(genre) {
  const genreSchema = Joi.object().keys({
    name: Joi.string().min(3).required(),
  });

  const result = genreSchema.validate(genre);
  return result;
}

module.exports = router;
