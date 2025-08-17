import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/connectDB';

import { requestLogger } from './middlewares/logger';

import authRouter from './routers/authRoute';
import userRouter from './routers/userRoute';
import publicRouter from './routers/publicRoute';
import adminRouter from './routers/adminRoute';
import { verifyAdmin, verifyUser } from './middlewares/verifyJwt';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { sendGlobalNotification } from './config/fcmConfig';
import { APP } from './utils/constants';

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// sendGlobalNotification("abc", "efg");

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/public', publicRouter);
app.use('/api/v1/user', verifyUser, userRouter);
app.use('/api/v1/admin', verifyAdmin, adminRouter);

const PORT = APP.PORT;
    connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});