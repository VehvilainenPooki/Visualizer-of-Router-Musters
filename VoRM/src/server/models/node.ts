import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/connection.js'

class Node extends Model<InferAttributes<Node>, InferCreationAttributes<Node>> {
  declare id: CreationOptional<number>
  declare illustrationId: number
  declare nodeTypeId: number
  declare name: CreationOptional<string | null>
  declare isStatic: CreationOptional<boolean>
  declare x: CreationOptional<number | null>
  declare y: CreationOptional<number | null>
}

Node.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  illustrationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nodeTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isStatic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_static'
  },
  x: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'node'
})

export { Node }
