import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useUserStore from "./stores/userStore";
import "./App.css";

// Public pages
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
import Projects from "./pages/Portfolios/Portfolios";
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
import SubmitTestimonial from "./pages/SubmitTestimonial/SubmitTestimonial";


// Admin pages
import Login from "./pages/Admin/LoginPage/Login";
import Admin from "./pages/Admin/AdminPage/Admin";
import ManageServices from "./pages/Admin/ManageServices/ManageServices";
import ManagePortfolio from "./pages/Admin/ManagePortfolio/ManagePortfolio";
import ManageBlog from "./pages/Admin/ManageBlogs/ManageBlogs";
import PaySlipGenerator from "./pages/Admin/PaySlipGenerator/PaySlipGenerator";
import ManageContact from "./pages/Admin/ManageContact/ManageContact";
import Scheduler from "./pages/Admin/Scheduler/Scheduler";
import ManageEmployee from "./pages/Admin/ManageEmployee/ManageEmployee";
import ManageNewsletter from "./pages/Admin/ManageNewsletter/ManageNewsletter";
import ManagePrivacyPolicy from "./pages/Admin/ManagePrivacyPolicy/ManagePrivacyPolicy";
import ManageCookiesPolicy from "./pages/Admin/ManageCookiesPolicy/ManageCookiesPolicy";
import ManageTermsOfService from "./pages/Admin/ManageTermsOfService/ManageTermsOfService";
import ManagePaySlip from "./pages/Admin/ManagePaySlip/ManagePaySlip";
import ManageTestimonials from "./pages/Admin/ManageTestimonials/ManageTestimonials";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";


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

  const initAuth = useUserStore((state) => state.initAuth);
  const loading = useUserStore((state) => state.loading);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if(user)
    initAuth(); //  refresh access token + fetch user
  }, [initAuth]);

  if (loading) return <p>Loading...</p>; // wait until auth is checked


  return (
    <div className="app">
      <Routes>
        {/* Public admin login (no navbar/footer) */}
        <Route path="/admin-login" element={<Login />} />

        {/* Admin routes protected by ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute >
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="manage-services" element={
            <ProtectedRoute requiredPermission="MANAGE_SERVICES">
              <ManageServices />
            </ProtectedRoute>
          }/>
          <Route path="manage-portfolio" element={
            <ProtectedRoute requiredPermission="MANAGE_PORTFOLIO">
              <ManagePortfolio />
            </ProtectedRoute>
            }/>
          <Route path="manage-blog" element={
            <ProtectedRoute requiredPermission="MANAGE_BLOG">
              <ManageBlog />
            </ProtectedRoute>
            } />
          <Route path="pay-slip-generator" element={
            <ProtectedRoute requiredPermission="GENERATE_PAYSLIP">
              <PaySlipGenerator />
            </ProtectedRoute>
            } />
          <Route path="manage-messages" element={
            <ProtectedRoute requiredPermission="MANAGE_MESSAGES">
              <ManageContact />
            </ProtectedRoute>
            } />
          <Route path="scheduler" element={
            <ProtectedRoute requiredPermission="MANAGE_SCHEDULER">
              <Scheduler />
            </ProtectedRoute>
            } />
          <Route path="employee-management" element={
            <ProtectedRoute requiredPermission="MANAGE_EMPLOYEES">
              <ManageEmployee />
            </ProtectedRoute>
            } />
          <Route path="newsletter-management" element={
            <ProtectedRoute requiredPermission="MANAGE_NEWSLETTER">
              <ManageNewsletter />
            </ProtectedRoute>
            } />
          <Route path="policy-management/privacy" element={
            <ProtectedRoute requiredPermission="MANAGE_PRIVACY_POLICY">
              <ManagePrivacyPolicy />
            </ProtectedRoute>
            } />
          <Route path="policy-management/cookies" element={
            <ProtectedRoute requiredPermission="MANAGE_COOKIES_POLICY">
              <ManageCookiesPolicy />
            </ProtectedRoute>
            } />
          <Route path="policy-management/terms" element={
            <ProtectedRoute requiredPermission="MANAGE_TERMS_POLICY">
              <ManageTermsOfService />
            </ProtectedRoute>
            } />
          <Route path="pay-slip-manager" element={
            <ProtectedRoute requiredPermission="MANAGE_PAYSLIP">
              <ManagePaySlip />
            </ProtectedRoute>
            } />
          <Route path="testimonials-management" element={
            // <ProtectedRoute requiredPermission="MANAGE_TESTIMONIALS">
              <ManageTestimonials />
            // </ProtectedRoute>
            } />
          <Route path="" element={
            <ProtectedRoute requiredPermission="VIEW_DASHBOARD">
              <Dashboard />
            </ProtectedRoute>
            } />

        </Route>

        {/* Public routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:service_id" element={<ServiceDetails />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:portfolio_item_id" element={<ProjectDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:blog_id" element={<BlogDetails />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />

        </Route>
        
        <Route path="/testimonial/:token" element={<SubmitTestimonial />} />

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
