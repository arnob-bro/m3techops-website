const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const createAuthRouter = require("./src/routes/authRoutes");
const createInquiryRouter = require("./src/routes/inquiryRoutes");
const createRoleRouter = require("./src/routes/roleRoutes");
const createNewsLetterRouter = require("./src/routes/newsLetterRoutes");
const createServiceRouter = require("./src/routes/serviceRoutes");
const createPolicyRouter = require("./src/routes/policyRoutes");
const createPortfolioRouter = require("./src/routes/portfolioRoutes");
const createBlogRouter = require("./src/routes/blogRoutes");
const createEmployeeRouter = require("./src/routes/employeeRoutes");
const createPayslipRouter = require("./src/routes/payslipRoutes");
const createSchedulerRouter = require("./src/routes/schedulerRoutes");
const createTestimonialRouter = require("./src/routes/testimonialRoutes");

const AuthController = require("./src/controllers/authController");
const InquiryController = require("./src/controllers/inquiryController");
const RoleController = require("./src/controllers/roleController");
const NewsLetterController = require("./src/controllers/newsLetterController");
const ServiceController = require("./src/controllers/serviceController");
const PolicyController = require("./src/controllers/policyController");
const PortfolioController = require("./src/controllers/portfolioController");
const BlogController = require("./src/controllers/blogController");
const EmployeeController = require("./src/controllers/employeeController");
const PayslipController = require("./src/controllers/payslipController");
const SchedulerController = require("./src/controllers/schedulerController");
const TestimonialController = require("./src/controllers/testimonialController");

const UserService = require("./src/services/userService");
const InquiryService = require("./src/services/inquiryService");
const RoleService = require("./src/services/roleService");
const NewsLetterService = require("./src/services/newsLetterService");
const ServiceService = require("./src/services/serviceService");
const PolicyService = require("./src/services/policyService");
const PortfolioService = require("./src/services/portfolioService");
const BlogService = require("./src/services/blogService");
const EmployeeService = require("./src/services/employeeService");
const PayslipService = require("./src/services/payslipService");
const SchedulerService = require("./src/services/schedulerService");
const TestimonialService = require("./src/services/testimonialService");


const db = require("./src/config/database");

// Controllers
// const { getUsersByLetter, addUser } = require("./controllers/controller");

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://m3techops-website.vercel.app",
  "https://www.m3techops.com/"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
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
const portfolioService = new PortfolioService(db);
const blogService = new BlogService(db);
const employeeService = new EmployeeService(db, userService, roleService);
const payslipService = new PayslipService(db);
const schedulerService = new SchedulerService(db);
const testimonialService = new TestimonialService(db);

const authController = new AuthController(userService);
const inquiryController = new InquiryController(inquiryService);
const roleController = new RoleController(roleService);
const newsLetterController = new NewsLetterController(newsLetterService);
const serviceController = new ServiceController(serviceService);
const policyController = new PolicyController(policyService);
const portfolioController = new PortfolioController(portfolioService);
const blogController = new BlogController(blogService);
const employeeController = new EmployeeController(employeeService);
const payslipController = new PayslipController(payslipService);
const schedulerController = new SchedulerController(schedulerService);
const testimonialController = new TestimonialController(testimonialService);

const authRouter = createAuthRouter(authController);
const inquiryRouter = createInquiryRouter(inquiryController);
const roleRouter = createRoleRouter(roleController);
const newsLetterRouter = createNewsLetterRouter(newsLetterController);
const serviceRouter = createServiceRouter(serviceController);
const policyRouter = createPolicyRouter(policyController);
const portfolioRouter = createPortfolioRouter(portfolioController);
const blogRouter = createBlogRouter(blogController);
const employeeRouter = createEmployeeRouter(employeeController);
const payslipRouter = createPayslipRouter(payslipController);
const schedulerRouter = createSchedulerRouter(schedulerController);
const testimonialRouter = createTestimonialRouter(testimonialController);



// API routes
app.use("/auth", authRouter);
app.use("/inquiry", inquiryRouter); 
app.use("/role", roleRouter);
app.use("/newsletter", newsLetterRouter);
app.use("/service", serviceRouter);
app.use("/policy", policyRouter);
app.use("/portfolio", portfolioRouter);
app.use("/blog", blogRouter);
app.use("/employee", employeeRouter);
app.use("/payslip", payslipRouter);
app.use("/scheduler", schedulerRouter);
app.use("/testimonial", testimonialRouter);

module.exports = app;
