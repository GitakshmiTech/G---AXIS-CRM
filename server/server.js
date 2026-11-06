require("dotenv").config();

const express = require("express");
const serverConfig = require("./config/server.config");
const leadsRoutes = require("./modules/leads/leads.routes");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");
const { connectDatabase } = require("./database/connection");
const corsMiddleware = require("./middlewares/cors.middleware");

const app = express();

// CORS setup
app.use(corsMiddleware);

// Global middleware
app.use(express.json());

//rate limit setup
app.use("/api", apiLimiter);


// Root test API
app.get(`${serverConfig.API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to g-CRM Backend API",
  });
});

// Leads API
app.use(
  `${serverConfig.API_PREFIX}/leads`,
  leadsRoutes
);
// Start server
const startServer = async () => {
    try {
        // Connect database first
        await connectDatabase();

        // Start Express server only after DB connection
        app.listen(serverConfig.PORT, () => {
            console.log(
                `g-CRM server running on http://localhost:${serverConfig.PORT}${serverConfig.API_PREFIX}/`
            );
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();