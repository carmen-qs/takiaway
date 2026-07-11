import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import ArtistDetail from "./pages/ArtistDetail";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminArtists from "./pages/admin/AdminArtists";
import UserLogin from "./pages/user/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/artist/:id" element={<ArtistDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute>
                    <AdminMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/artists"
                element={
                  <ProtectedRoute>
                    <AdminArtists />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
