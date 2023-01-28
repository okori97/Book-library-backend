const { Book } = require("../models");

exports.createBook = async (req, res) => {
  const result = await Book.create(req.body);
  res.status(201).json(result);
};

exports.getAllBooks = async (req, res) => {
  const result = await Book.findAll();

  res.status(201).json(result);
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  const result = await Book.findByPk(id, { raw: true });

  if (result != null) {
    res.status(201).json(result);
  } else {
    res.status(404).json({ error: "The book could not be found" });
  }
};

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const [updatedBook] = await Book.update(updatedData, {
    where: { id: `${id}` },
  });

  if (updatedBook === 0) {
    res.status(404).json({ error: "The book could not be found" });
  }

  res.status(201).json(updatedBook);
};

exports.deleteBookById = async (req, res) => {
  const { id } = req.params;
  const deletedRows = await Book.destroy({ where: { id: `${id}` } });

  if (deletedRows === 0) {
    res.status(404).json({ error: "The book could not be found" });
  }

  res.status(204).json(deletedRows);

  console.log(deletedRows);
};
