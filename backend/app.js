const express = require("express");
const cors = require("cors");
// const createAuthRouter = require("./routes/authRoutes");
// const AuthController = require("./controllers/authController");
// const UserService = require("./services/userService");
const db = require("./src/config/supabaseClient");

// Controllers
// const { getUsersByLetter, addUser } = require("./controllers/controller");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

//Dependency injection
// const userService = new UserService(db);

// const authController = new AuthController(userService);

// const authRouter = createAuthRouter(authController);

// API routes
// app.use("/auth", authRouter);

module.exports = app;
