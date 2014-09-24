module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Answer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    input: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    output: {
      type: DataTypes.TEXT
    },
    error: {
      type: DataTypes.TEXT
    },
    isSuccessful: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    isFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    }
  }, {
    indexes: [{
      name: 'questionUser',
      fields: ['questionId', 'userId']
    }]
  });
};