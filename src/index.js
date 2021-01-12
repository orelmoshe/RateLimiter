import express from 'express';
import router from './routes/routes';
import rateLimiter from './services/rateLimiter';

const app = express();
const PORT = 3000;
// init rate limiter
const rateLimit = rateLimiter({
	windowHours: 24,
	max: 100,
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// use rate limiter
app.use(rateLimit);

app.use('/', router);

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});

export default app;
