import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'learner');
          } else {
            setUserRole('learner');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('learner');
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  const isAuthenticated = !!user;
  const isEmailVerified = user?.emailVerified || false;
  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      logout, 
      isAuthenticated, 
      isEmailVerified, 
      isAdmin, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
