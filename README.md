# RateLimiter

The purpose of this project is to create a rate-limiting module that stops a particular requester from making too many HTTP requests within a particular period of time.

- If the request didn't exceed the limit, the response will be Ok (status code 200)
- If the request exceeds the limit, the response will be TooManyRequests (status code 429)
- If a request with error (status code 500)

---

# Design/Algorithm

High level system setup looks like this:

![alt text](https://res.cloudinary.com/dyy8fcstp/image/upload/v1610442976/ratelimiter/high_level_ymlkbz.png)

---

Recently I came across an interesting problem of building an API rate limiter. While doing a bit of research on the same, I came across various algorithms and approaches. Some of the popular algorithms used to implement rate limiting are:

- Token bucket
- Leaky bucket
- Fixed window counter
- Sliding window log
- Sliding window counter

This project is NOT about these algorithms. I will try and explain an alternative approach here which makes use of certain Redis specific features.

---

There’s quite a lot going on here, so let’s do a step-by-step walkthrough:

We installed and imported Redis and Moment.js from npm and initialized all useful constants. We use Redis as an in-memory storage for keeping track of user activity, while Moment helps us accurately parse, validate, manipulate, and display dates and times in JavaScript.

Next, we create a middleware, customRedisRateLimiter, within which we are to implement the rate limiting logic. Inside the middleware function’s try block, we check that the Redis client exists and throw an error if it doesn’t.

Using the user’s IP address req.ip, we fetch the user’s record from Redis. If null is returned, this indicates that no record has been created yet for the user in question. Thus, we create a new record for this user and store it to Redis by calling the set() method on the Redis client.

If a record was found, the value is returned. Thus, we parse that value to JSON and proceed to calculate if the user is eligible to get a response. In order to determine this, we calculate the cumulative sum of requests made by the user in the last window by retrieving all logs with timestamps that are within the last 24 hours and sum their corresponding requestCount.

If the number of requests in the last window — i.e., totalWindowRequestsCount — is equal to the permitted maximum, we send a response to the user with a constructed error message indicating that the user has exceeded their limit.

However, if totalWindowRequestsCount is less than the permitted limit, the request is eligible for a response. Thus, we perform some checks to see whether it’s been up to one hour since the last log was made. If it has been up to one hour, we create a new log for the current timestamp. Otherwise, we increment the requestCount on the last timestamp and store (update) the user’s record on Redis.

---

# Create middleware for Node:

```javascript
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
```
