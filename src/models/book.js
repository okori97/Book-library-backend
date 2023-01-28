module.exports = (connection, DatTypes) => {
  const schema = {
    title: DatTypes.STRING,
    author: DatTypes.STRING,
    genre: DatTypes.STRING,
    ISBN: DatTypes.STRING,
  };

  const bookModel = connection.define("Book", schema);
  return bookModel;
};
