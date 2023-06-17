const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const morganDebugger = require("debug")("app:morgan");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
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

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);

const port = process.env.PORT || 3000;
app.listen(port, () => startupDebugger("Listening on port " + port));
