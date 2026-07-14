import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/connection.js'

class Illustration extends Model<InferAttributes<Illustration>, InferCreationAttributes<Illustration>> {
  declare id: CreationOptional<number>
  declare userId: number
  declare name: CreationOptional<string>
  declare description: string | null
  declare graphcode: CreationOptional<object>
}

Illustration.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Untitled'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  graphcode: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'illustration'
})

export { Illustration }
