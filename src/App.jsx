import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ARConcepts from "./pages/ARConcepts";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { SearchProvider } from "./context/SearchContext";
import { LanguageProvider } from "./context/LanguageContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { NavigationProvider } from "./context/NavigationContext";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <LanguageProvider>
              <ContentProvider>
                <FavoritesProvider>
                  <SearchProvider>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      <Route path="/" element={<Home />} />
                      <Route path="/ar" element={<ARConcepts />} />

                      <Route path="/search" element={
                        <ProtectedRoute>
                          <Search />
                        </ProtectedRoute>
                      } />

                      <Route path="/subjects" element={
                        <ProtectedRoute>
                          <Subjects />
                        </ProtectedRoute>
                      } />

                      <Route path="/subjects/:subjectId" element={
                        <ProtectedRoute>
                          <Subjects />
                        </ProtectedRoute>
                      } />

                      <Route path="/subjects/:subjectId/:topicId" element={
                        <ProtectedRoute>
                          <Subjects />
                        </ProtectedRoute>
                      } />

                      <Route path="/subjects/:subjectId/:topicId/:conceptId" element={
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

                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                    </Routes>
                  </SearchProvider>
                </FavoritesProvider>
              </ContentProvider>
            </LanguageProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
