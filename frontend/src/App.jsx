import { Routes, Route } from "react-router-dom"
import POS from "./pages/POS/POS"
import "./App.css"
import Dashboard from "./pages/Dashboard/Dashboard"
import Home from "./pages/Home/Home"
import ProtectedRoute from "./components/PermissionComponents/ProtectedRoute"



function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/contact" element={<ContactUs />} />
            

            {/* POS - No specific permission required for authenticated users */}
            <Route
                path="/sales-interface"
                element={
                    <ProtectedRoute>
                        <POS />
                    </ProtectedRoute>
                }
            />

            {/* Dashboard - Requires dashboard:view permission */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute requiredPermission="dashboard:view">
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="/*" element={<NotFound />} />  

        </Routes>
    )
}

export default App
