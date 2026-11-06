const { rateLimit } = require("express-rate-limit");

const {
  errorResponse,
} = require("../common/helpers/response.helper");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Maximum 100 requests per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return errorResponse(
      res,
      "Too many requests. Please try again after 15 minutes.",
      429,
      "API rate limit exceeded"
    );
  },
});

// Strict rate limiter for authentication APIs
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 10, // Maximum 5 requests per IP
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    return errorResponse(
      res,
      "Too many login attempts. Please try again after 15 minutes.",
      429,
      "Authentication rate limit exceeded"
    );
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};