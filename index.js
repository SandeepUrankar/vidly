const express = require("express");
const Joi = require("joi");
require("dotenv").config();
const app = express();
app.use(express.json());

let genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Drama" },
  { id: 3, name: "Sci-fi" },
  { id: 4, name: "Horror" },
];

// 1. Get all genre
app.get("/api/genres", (req, res) => {
  res.send(JSON.stringify(genres));
});

// 2. Create a new genre
app.post("/api/genres", (req, res) => {
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
app.put("/api/genres/:id", (req, res) => {
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
app.delete("/api/genres/:id", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));

function validateInput(genre) {
  const genreSchema = Joi.object().keys({
    name: Joi.string().min(3).required(),
  });

  const result = genreSchema.validate(genre);
  return result;
}
