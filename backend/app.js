const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const createAuthRouter = require("./src/routes/authRoutes");
const createInquiryRouter = require("./src/routes/inquiryRoutes");
const createRoleRouter = require("./src/routes/roleRoutes");
const createNewsLetterRouter = require("./src/routes/newsLetterRoutes");
const createServiceRouter = require("./src/routes/serviceRoutes");
const createPolicyRouter = require("./src/routes/policyRoutes");
const AuthController = require("./src/controllers/authController");
const InquiryController = require("./src/controllers/inquiryController");
const RoleController = require("./src/controllers/roleController");
const NewsLetterController = require("./src/controllers/newsLetterController");
const ServiceController = require("./src/controllers/serviceController");
const PolicyController = require("./src/controllers/policyController");
const UserService = require("./src/services/userService");
const InquiryService = require("./src/services/inquiryService");
const RoleService = require("./src/services/roleService");
const NewsLetterService = require("./src/services/newsLetterService");
const ServiceService = require("./src/services/serviceService");
const PolicyService = require("./src/services/policyService");

const db = require("./src/config/supabaseClient");

// Controllers
// const { getUsersByLetter, addUser } = require("./controllers/controller");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, 
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
const newsLetterService = new NewsLetterService(db);
const serviceService = new ServiceService(db);
const policyService = new PolicyService(db);

const authController = new AuthController(userService);
const inquiryController = new InquiryController(inquiryService);
const roleController = new RoleController(roleService);
const newsLetterController = new NewsLetterController(newsLetterService);
const serviceController = new ServiceController(serviceService);
const policyController = new PolicyController(policyService);

const authRouter = createAuthRouter(authController);
const inquiryRouter = createInquiryRouter(inquiryController);
const roleRouter = createRoleRouter(roleController);
const newsLetterRouter = createNewsLetterRouter(newsLetterController);
const serviceRouter = createServiceRouter(serviceController);
const policyRouter = createPolicyRouter(policyController);



// API routes
app.use("/auth", authRouter);
app.use("/inquiry", inquiryRouter); 
app.use("/role", roleRouter);
app.use("/newsletter", newsLetterRouter);
app.use("/service", serviceRouter);
app.use("/policy", policyRouter);

module.exports = app;
