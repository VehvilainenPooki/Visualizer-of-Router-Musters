import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/connection.js'

class Link extends Model<InferAttributes<Link>, InferCreationAttributes<Link>> {
  declare id: CreationOptional<number>
  declare illustrationId: number
  declare linkTypeId: number
  declare sourceNodeId: number
  declare targetNodeId: number
}

Link.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  illustrationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  linkTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sourceNodeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetNodeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'link'
})

export { Link }
