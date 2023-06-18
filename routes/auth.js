const router = require("express").Router();
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name").select("name email");
  return res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(`Invalid email or password. `);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send(`Invalid email or password. `);

  const token = user.generateAuthToken();
  res.status(200).send(token);
});

function validate(user) {
  const userValidator = Joi.object().keys({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  const result = userValidator.validate(user);
  return result;
}

module.exports = router;
