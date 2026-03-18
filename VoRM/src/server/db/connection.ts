import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

const DATABASE_URL = "postgresql://postgres:postgres@db:5432/postgres"

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

export const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log(migrations)
}

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}
