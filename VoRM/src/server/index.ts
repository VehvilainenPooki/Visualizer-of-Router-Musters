import express from 'express'

import { connectToDatabase } from './db/connection.ts'
import usersRouter from './controllers/users.ts'
import loginRouter from './controllers/login.ts'

const app = express();
const PORT = 3001;


app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.post('/api/networkGraphs', (req, res) => {
  res.json({ message: req.body.content });
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const start = async() => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start()