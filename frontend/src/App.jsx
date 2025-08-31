import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// Public pages
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import ContactUs from "./pages/ContactUs/ContactUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import Navbar from "./pages/Navbar/Navbar";
import Footer from "./pages/Footer/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy/CookiePolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";

// Admin pages
import Login from "./pages/Admin/LoginPage/Login";
import Admin from "./pages/Admin/AdminPage/Admin";
import ManageServices from "./pages/Admin/ManageServices/ManageServices";
import ManagePortfolio from "./pages/Admin/ManagePortfolio/ManagePortfolio";
import ManageBlog from "./pages/Admin/ManageBlogs/ManageBlogs";
import PaySlipGenerator from "./pages/Admin/PaySlipGenerator/PaySlipGenerator";
import ManageContact from "./pages/Admin/ManageContact/ManageContact";
import Scheduler from "./pages/Admin/Scheduler/Scheduler";

// Components
import ProtectedRoute from "./components/PermissionComponents/ProtectedRoute";

// 404 page (simple fallback)
const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404 - Page Not Found</h1>
    <a href="/" style={{ color: "#ff8800" }}>Go Back Home</a>
  </div>
);

// Layout for public pages
const MainLayout = () => (
  <>
    <Navbar />
    <main className="app-content">
      <Outlet /> {/* Nested public routes render here */}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public admin login (no navbar/footer) */}
        <Route path="/admin-login" element={<Login />} />

        {/* Admin routes protected by ProtectedRoute */}
        <Route
          path="/admin"
          element={
            // <ProtectedRoute >
              <Admin />
            // </ProtectedRoute>
          }
        >
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="manage-portfolio" element={<ManagePortfolio />} />
          <Route path="manage-blog" element={<ManageBlog />} />
          <Route path="pay-slip-generator" element={<PaySlipGenerator />} />
          <Route path="manage-messages" element={<ManageContact />} />
          <Route path="scheduler" element={<Scheduler />} />
          
        </Route>

        {/* Public routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          

        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
