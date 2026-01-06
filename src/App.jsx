import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/subjects" element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
