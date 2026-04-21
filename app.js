const express = require("express");
const studentRoutes = require("./routes/student.routes");
const logger = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;