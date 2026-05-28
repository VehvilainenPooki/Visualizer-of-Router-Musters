import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/connection.js'

class Illustration extends Model<InferAttributes<Illustration>, InferCreationAttributes<Illustration>> {
  declare id: CreationOptional<number>
  declare userId: number
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
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'illustration'
})

export { Illustration }
