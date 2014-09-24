module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    entryFunction: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    sampleInput: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    testInput: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    }
  });
};