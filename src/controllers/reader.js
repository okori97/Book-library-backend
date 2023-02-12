const { Reader } = require("../models");

exports.createReader = async (req, res) => {
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

  if (!email) {
    res.status(401).json({ error: "You must input an email address" });
  }

  if (password.length < 9) {
    res
      .status(401)
      .json({ error: "Password must be longer than 8 characters" });
  }

  if (!name) {
    res.status(401).json({ error: "reader name cannot be empty" });
  }

  try {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "it is a Validation Error" });
    }
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ error: "Unique Constraint Error" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllReaders = async (_, res) => {
  const result = await Reader.findAll();
  res.status(200).json(result);
};

exports.getReaderById = async (req, res) => {
  const { id } = req.params;

  const result = await Reader.findByPk(id);
  if (result === null) {
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

  res.status(200).json(updatedReader);
};

exports.deleteReaderById = async (req, res) => {
  const { id } = req.params;
  const deletedReader = await Reader.destroy({ where: { id: `${id}` } });

  if (deletedReader != 1) {
    res.status(404).json({ error: "The reader could not be found" });
  }

  res.status(204).json(deletedReader);
};
