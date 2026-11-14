require("dotenv").config();

const express = require("express");
const serverConfig = require("./config/server.config");
const authRoutes = require("./modules/auth/auth.routes");
const leadsRoutes = require("./modules/leads/leads.routes");
const accountsRoutes = require("./modules/accounts/accounts.routes");
const contactsRoutes = require("./modules/contacts/contacts.routes");
const dealsRoutes = require("./modules/deals/deals.routes");
const mastersRoutes = require("./modules/masters/masters.routes");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");
const { connectDatabase } = require("./database/connection");
const corsMiddleware = require("./middlewares/cors.middleware");

const app = express();

// CORS setup
app.use(corsMiddleware);

app.use(express.json());

// Rate limit
app.use(serverConfig.API_PREFIX, apiLimiter);

// Test API
app.get(`${serverConfig.API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to g-CRM Backend API",
  });
});

// APPLICATION ROUTE
app.use(`${serverConfig.API_PREFIX}/auth`, authRoutes);
app.use(`${serverConfig.API_PREFIX}/leads`, leadsRoutes);
app.use(`${serverConfig.API_PREFIX}/accounts`, accountsRoutes);
app.use(`${serverConfig.API_PREFIX}/contacts`, contactsRoutes);
app.use(`${serverConfig.API_PREFIX}/deals`, dealsRoutes);
app.use(`${serverConfig.API_PREFIX}/masters`, mastersRoutes);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
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