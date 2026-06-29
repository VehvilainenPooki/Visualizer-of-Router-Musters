import { connectToDatabase } from './db/connection.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import permissionsPolicy from './middleware/permissionsPolicy.js'
import helperRouter from './helperRoutes.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import illustrationsRouter from './controllers/illustrations.js'

const app = express()
const PORT = process.env.PORT ?? 3001
const inProduction = process.env.IN_PRODUCTION === 'true'

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? []
app.use(helmet())
app.use(permissionsPolicy)
app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

if (inProduction) {
  console.log(`PRODUCTION running on port ${PORT}`)
  app.use(express.static(path.join(process.cwd(), 'build/src/client')))
}

app.use('/api', helperRouter)
app.use('/api/users/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/illustrations', illustrationsRouter)

if (inProduction) {
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'build/src/client/index.html'))
  })
}

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
