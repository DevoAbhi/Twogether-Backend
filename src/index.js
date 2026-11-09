import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { requireAccessCode } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './services/seedService.js';
import routes from './routes/index.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', requireAccessCode, routes);
app.use(errorHandler);

await connectDatabase();
await seedDatabase();

app.listen(env.port, () => {
  console.log(`Our Little World API running on port ${env.port}`);
});
