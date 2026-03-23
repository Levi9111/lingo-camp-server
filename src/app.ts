import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/', (_, res) => res.send('🚀 LingoCamp server'));
app.use('/api', router);

app.use(errorHandler);

export default app;