import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Blog from "./pages/Blog/Blog";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import ContactUs from "./pages/ContactUs/ContactUs";
import Navbar from "./pages/Navbar/Navbar";
import Footer from "./pages/Footer/Footer";
import AboutUs from "./pages/AboutUs/AboutUs";
import ProtectedRoute from "./components/PermissionComponents/ProtectedRoute";
import Login from "./pages/Admin/LoginPage/Login";
import Admin from "./pages/Admin/AdminPage/Admin";
import ManageServices from "./pages/Admin/ManageServices/ManageServices";
import ManagePortfolio from "./pages/Admin/ManagePortfolio/ManagePortfolio";
import ManageBlog from "./pages/Admin/ManageBlogs/ManageBlogs";

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Admin routes - no navbar/footer */}
        <Route path="/admin-login" element={<Login />} />
        
        {/* Nested admin routes */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<div>Admin Dashboard</div>} />
          <Route path="manage-services" element={<ManageServices />} />
          <Route path="manage-portfolio" element={<ManagePortfolio />} />
          <Route path="manage-blog" element={<ManageBlog />} />
          
          {/* Add other admin routes here */}
        </Route>
        
        {/* Main routes with navbar/footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetails />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/*" element={<div>Page Not Found</div>} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;