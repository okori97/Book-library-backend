const { Reader } = require("../models");

exports.createReader = async (req, res) => {
  const newReader = await Reader.create(req.body);
  res.status(201).json(newReader);
};

exports.getAllReaders = async (req, res) => {
  const result = await Reader.findAll();
  res.status(200).json(result);
};

exports.getReaderById = async (req, res) => {
  const { id } = req.params;

  const result = await Reader.findByPk(id);
  if (result === null) {
    console.log("is 404");
    res.status(404).json({ error: "The reader could not be found" });
  }
  res.status(200).json(result);
};

exports.updateReaderById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const [updatedReader] = await Reader.update(updatedData, {
    where: { id: `${id}` },
  });

  if (updatedReader === 0) {
    res.status(404).json({ error: "The reader could not be found" });
  }

  res.status(200).json(updatedReader.rows);
};

exports.deleteReaderById = async (req, res) => {
  const { id } = req.params;
  const deletedReader = await Reader.destroy({ where: { id: `${id}` } });
  console.log();

  if (deletedReader != 1) {
    res.status(404).json({ error: "The reader could not be found" });
  }

  res.status(204).json(deletedReader);
};
