import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db/connection.js'

class LinkType extends Model<InferAttributes<LinkType>, InferCreationAttributes<LinkType>> {
  declare id: CreationOptional<number>
  declare name: string
}

LinkType.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'link_type'
})

export { LinkType }
