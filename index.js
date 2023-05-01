const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const genres = require("./routes/genres");
app.use(express.json());

if (app.get("env") === "development") {
  app.use(
    morgan("tiny", {
      stream: {
        write: function (msg) {
          startupDebugger(msg);
        },
      },
    })
  );
  startupDebugger("Morgan is enabled...");
}

app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on port " + port));
