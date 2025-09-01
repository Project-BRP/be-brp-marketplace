import './configs/env';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { appLogger } from './configs/logger';
import { currentEnv, Env, CLIENT_URL } from './constants';
import { errorMiddleware } from './middlewares/error-middleware';
import { socketAuthMiddleware } from './middlewares';
import { registerSocketHandlers } from './sockets/register-socket';
import {
  healthRoute,
  authRoute,
  productTypeRoute,
  productRoute,
  packagingRoute,
  productVariantRoute,
  configRoute,
  cartRoute,
  cartItemRoute,
  ppnRoute,
  transactionRoute,
  shippingRoute,
  companyInfoRoute,
  reportRoute,
  chatRoute,
} from './routes';

const app: Express = express();
const httpServer = createServer(app);

let origin: string[] = [];

if (currentEnv === Env.DEVELOPMENT) {
  origin = [CLIENT_URL.DEVELOPMENT, CLIENT_URL.LOCAL];
} else if (currentEnv === Env.PRODUCTION) {
  origin = [CLIENT_URL.PRODUCTION];
} else if (currentEnv === Env.TESTING) {
  origin = [CLIENT_URL.LOCAL];
} else {
  appLogger.error('Invalid environment');
  process.exit(1);
}

export const io = new Server(httpServer, {
  cors: {
    origin: origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: origin,
  }),
);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/', healthRoute);
app.use('/api/config', configRoute);
app.use('/api/auth', authRoute);
app.use('/api/product-types', productTypeRoute);
app.use('/api/products', productRoute);
app.use('/api/packagings', packagingRoute);
app.use('/api/product-variants', productVariantRoute);
app.use('/api/carts', cartRoute);
app.use('/api/cart-items', cartItemRoute);
app.use('/api/ppn', ppnRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/shipping', shippingRoute);
app.use('/api/company-info', companyInfoRoute);
app.use('/api/reports', reportRoute);
app.use('/api/chats', chatRoute);

app.use(errorMiddleware);

const port = Number(process.env.PORT_SERVER) || 5000;

registerSocketHandlers(io);

httpServer.listen(port, '0.0.0.0', () => {
  appLogger.info(`Server is running on port ${port}`);
});
