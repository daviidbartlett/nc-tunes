const express = require("express");

const {
  handlePathNotFound,
  handleBadRequests,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errors");

const apiRouter = require("./routes/api.router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handlePathNotFound);

// EHMFs
app.use(handleCustomErrors);

app.use(handleBadRequests);

app.use(handleInternalServerErrors);

module.exports = app;
