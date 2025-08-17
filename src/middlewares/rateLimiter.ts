import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../utils/constants";

export const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_IN_MILLIS, // 15 minutes
  max: RATE_LIMIT.REQ_PER_WINDOW, // Limit each IP to 100 requests per `window` (15 mins)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
