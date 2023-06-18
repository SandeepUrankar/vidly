const router = require("express").Router();
const _ = require("lodash");
const { User, validate } = require("../models/users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name").select("name email");
  return res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`User already exist. `);

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();

  res.status(200).send(_.pick(user, ["_id", "name", "email"]));
});
module.exports = router;
