import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

// Auth-specific limiter (stronger)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // login/register attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});
