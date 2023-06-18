const router = require("express").Router();
const _ = require("lodash");
const { User, validate } = require("../models/users");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`User already exist. `);

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(200)
    .send(_.pick(user, ["_id", "name", "email"]));
});
module.exports = router;
