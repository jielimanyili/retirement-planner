import express from 'express';
import cors from 'cors';
import projectionsRouter from './routes/projections';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'retirement-planner-api',
      time: new Date().toISOString(),
    });
  });

  app.use('/api/projections', projectionsRouter);

  return app;
}
