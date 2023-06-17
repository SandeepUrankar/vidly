const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");
// 1. Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(JSON.stringify(customers));
});

// 2. Create a new customer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold || false,
    phone: req.body.phone,
  });

  customer = await customer.save();
  res.send(customer);
});

// 3. Update a customer
router.put("/:id", async (req, res) => {
  // Validate Input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone },
    { new: true }
  );
  if (!customer)
    return res
      .status(400)
      .send(`Customer with ${req.params.id} doesn't exists.`);
  res.send(JSON.stringify(customer));
});

// 4. Delete a customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res
      .status(400)
      .send(`Customer with id=${req.params.id} doesn't exists.`);
  res.send(customer);
});

module.exports = router;
