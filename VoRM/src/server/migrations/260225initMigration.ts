const { DataTypes } = require('sequelize')
module.exports = {
  up: async queryInterface => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      creation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },
  down: async queryInterface => {
    await queryInterface.dropTable('users')
  },
}