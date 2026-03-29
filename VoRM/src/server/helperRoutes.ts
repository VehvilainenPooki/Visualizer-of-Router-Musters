import express from "express"

const router = express.Router()

router.post('/networkGraphs', (req, res) => {
  res.json({ message: req.body.content });
});

router.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

export default router
