const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const morganDebugger = require("debug")("app:morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const connectDB = require("./db/db");
app.use(express.json());

if (app.get("env") === "development") {
  app.use(
    morgan("tiny", {
      stream: {
        write: function (msg) {
          morganDebugger(msg);
        },
      },
    })
  );
  startupDebugger("Morgan is enabled...");
}

// Connect to the database
connectDB();

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => startupDebugger("Listening on port " + port));
