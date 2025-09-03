const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const createAuthRouter = require("./src/routes/authRoutes");
const createInquiryRouter = require("./src/routes/inquiryRoutes");
const createRoleRouter = require("./src/routes/roleRoutes");
const AuthController = require("./src/controllers/authController");
const InquiryController = require("./src/controllers/inquiryController");
const RoleController = require("./src/controllers/roleController");
const UserService = require("./src/services/userService");
const InquiryService = require("./src/services/inquiryService");
const RoleService = require("./src/services/roleService");

const db = require("./src/config/supabaseClient");

// Controllers
// const { getUsersByLetter, addUser } = require("./controllers/controller");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // 👈 allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

//Dependency injection
const userService = new UserService(db);
const inquiryService = new InquiryService(db);
const roleService = new RoleService(db);

const authController = new AuthController(userService);
const inquiryController = new InquiryController(inquiryService);
const roleController = new RoleController(roleService);

const authRouter = createAuthRouter(authController);
const inquiryRouter = createInquiryRouter(inquiryController);
const roleRouter = createRoleRouter(roleController);


// API routes
app.use("/auth", authRouter);
app.use("/inquiry", inquiryRouter); 
app.use("/role", roleRouter);

module.exports = app;
