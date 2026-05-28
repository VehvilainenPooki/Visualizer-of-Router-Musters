import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@db:5432/postgres'
const inProduction = process.env.IN_PRODUCTION === 'true'

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: inProduction ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {},
})

export const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: path.join(__dirname, '../migrations/*.[tj]s'),
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
    process.exit(1)
  }
}
