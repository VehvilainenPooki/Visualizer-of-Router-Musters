import express from 'express';
import path from 'path';
import router from './helperRoutes.js'

const app = express();
const PORT = 3001;
const inProduction = process.env.IN_PRODUCTION === 'true';

app.use(express.json())

// Serve static files from Vite build output in production
if (inProduction) {
  app.use(express.static(path.join(process.cwd(), 'build/src/client')));
}

app.use("/api", router)

// Fallback to index.html for client-side routing in production
if (inProduction) {
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'build/src/client/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
