const express = require("express");
const dotenv = require("dotenv");
const plantRoutes = require("./routes/plantRoutes");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();
dotenv.config({ path: './config/config.env' });
const app = express();

const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/plants", plantRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Backend is running and ready to handle requests!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
