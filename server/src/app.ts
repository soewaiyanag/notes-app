import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

export default app;
