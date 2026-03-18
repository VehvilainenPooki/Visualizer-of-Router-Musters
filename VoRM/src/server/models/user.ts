import type { InferAttributes, InferCreationAttributes } from 'sequelize'
import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../db/connection'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number
  declare username: string
  declare passwordHash: string
  declare lastLogin: Date
  declare creationDate: Date
  declare isAdmin: boolean
}

User.init({
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
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

export {User}
