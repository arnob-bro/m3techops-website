const express = require("express");
const cors = require("cors");
// const createAuthRouter = require("./routes/authRoutes");
const createInquiryRouter = require("./src/routes/inquiryRoutes");
// const AuthController = require("./controllers/authController");
const InquiryController = require("./src/controllers/inquiryController");
// const UserService = require("./services/userService");
const InquiryService = require("./src/services/inquiryService");
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
const inquiryService = new InquiryService(db);

// const authController = new AuthController(userService);
const inquiryController = new InquiryController(inquiryService);

// const authRouter = createAuthRouter(authController);
const inquiryRouter = createInquiryRouter(inquiryController);

// API routes
// app.use("/auth", authRouter);
app.use("/inquiry", inquiryRouter);

module.exports = app;
