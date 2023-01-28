const express = require("express");
const app = express();
const readerRouter = require("./routes/readers");

app.use(express.json());
app.use("/readers", readerRouter);

app.get("/", (req, res) => {
  res.status(201).json("This is working");
});

module.exports = app;
