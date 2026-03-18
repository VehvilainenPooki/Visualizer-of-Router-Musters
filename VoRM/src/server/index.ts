import express from 'express';
import router from './helperRoutes.ts'

const app = express();
const PORT = 3001;

app.use(express.json())

app.use("/api", router)

/*app.post('/api/networkGraphs', (req, res) => {
  res.json({ message: req.body.content });
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
