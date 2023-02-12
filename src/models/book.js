module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
    author: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  const bookModel = connection.define("Book", schema);
  return bookModel;
};
