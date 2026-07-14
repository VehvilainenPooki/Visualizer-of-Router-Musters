import { DataTypes, QueryInterface } from 'sequelize'

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.createTable('node_types', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  await queryInterface.createTable('link_types', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  await queryInterface.createTable('illustrations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    }
  })

  await queryInterface.createTable('nodes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    illustration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'illustrations', key: 'id' },
      onDelete: 'CASCADE'
    },
    node_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'node_types', key: 'id' }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_static: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  })

  await queryInterface.createTable('links', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    illustration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'illustrations', key: 'id' },
      onDelete: 'CASCADE'
    },
    link_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'link_types', key: 'id' }
    },
    source_node_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'nodes', key: 'id' },
      onDelete: 'CASCADE'
    },
    target_node_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'nodes', key: 'id' },
      onDelete: 'CASCADE'
    }
  })
}

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.dropTable('links')
  await queryInterface.dropTable('nodes')
  await queryInterface.dropTable('illustrations')
  await queryInterface.dropTable('link_types')
  await queryInterface.dropTable('node_types')
}
