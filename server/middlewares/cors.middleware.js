const cors = require("cors");

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {

        // Allow requests without an Origin header
        // (e.g. Postman or server-to-server requests)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: true
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;