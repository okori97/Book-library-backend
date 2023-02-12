const express = require("express");
const app = express();
const readerRouter = require("./routes/readers");
const bookRouter = require("./routes/books");
const Sequelize = require("sequelize");

app.use(express.json());
app.use("/readers", readerRouter);
app.use("/books", bookRouter);

app.get("/", (req, res) => {
  res.status(201).json("This is working");
});

module.exports = app;
