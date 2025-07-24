import './configs/env';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// eslint-disable-next-line
import express, { Express } from 'express';
import path from 'path';

import { appLogger } from './configs/logger';
import { currentEnv, Env, CLIENT_URL } from './constants';
import { errorMiddleware } from './middlewares/error-middleware';
import {
  healthRoute,
  authRoute,
  productTypeRoute,
  productRoute,
  packagingRoute,
  productVariantRoute,
  configRoute,
} from './routes';

const app: Express = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// menentukan origin berdasarkan environment

let origin = [];

if (currentEnv === Env.DEVELOPMENT) {
  origin = [CLIENT_URL.DEVELOPMENT, CLIENT_URL.LOCAL];
} else if (currentEnv === Env.PRODUCTION) {
  origin = [CLIENT_URL.PRODUCTION];
} else if (currentEnv === Env.TESTING) {
  origin = [CLIENT_URL.LOCAL];
} else {
  appLogger.error('Invalid environment');
  process.exit(1); // exit ketika environment tidak valid
}

app.use(
  cors({
    credentials: true,
    origin: origin,
  }),
);

app.use(express.json());

// menambahkan path untuk mengakses file yang diupload
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// untuk mengecek kesehatan server
app.use('/api/', healthRoute);
app.use('/api/config', configRoute);
app.use('/api/auth', authRoute);
app.use('/api/product-types', productTypeRoute);
app.use('/api/products', productRoute);
app.use('/api/packagings', packagingRoute);
app.use('/api/product-variants', productVariantRoute);

app.use(errorMiddleware);

const port = Number(process.env.PORT_SERVER) || 5000;

export const server = app.listen(port, '0.0.0.0', () => {
  appLogger.info(`Server is running on port ${port}`);
});
