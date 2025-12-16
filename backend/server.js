// ? Importing required modules
// * internal modules
const path = require("path");
// * external modules
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
//* ====================================
//* ||========== Routes UI ===========||
//* ====================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const projectRoutes = require("./routes/projectRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

const app = express();
//? ==================Load environment variables====================
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//* connectDB
connectDB();

//? middlewares
app.use(express.json());

//? Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/about", aboutRoutes);

//? serve uploads folder
app.use("/uploads", express.static("uploads"));

//? Server Start Point
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
