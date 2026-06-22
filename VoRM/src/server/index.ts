import { connectToDatabase } from './db/connection.js'
import express from 'express'
import path from 'path'
import helperRouter from './helperRoutes.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import illustrationsRouter from './controllers/illustrations.js'

const app = express()
const PORT = process.env.PORT || 3001
const inProduction = process.env.IN_PRODUCTION === 'true'

app.use(express.json())

if (inProduction) {
  console.log("PRODUCTION")
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
