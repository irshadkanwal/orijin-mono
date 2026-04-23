import type React from "react";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { checkIsAdmin, getAllowedOrgs } from "@/services/auth-service.ts";
import {
  initAuth,
  type AppAuth,
  type OrganisationAccess,
  type UserWithToken,
} from "@/types/auth";

const AuthContext = createContext<AppAuth | undefined>(undefined);

// TODO: "ESLint: Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.(react-refresh/only-export-components)"
export const useAuth = (): AppAuth => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const orgDefault = {
  allowed: [],
  current: "",
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<AppAuth['currentUser'] | null>(null);
  const [organisations, setOrganisations] =
    useState<OrganisationAccess>(orgDefault);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  const checkTokenExpiry = async (user: any) => {
    if (!user) return null;

    const tokenResult = await user.getIdTokenResult();
    const tokenExpirationTime = new Date(tokenResult.expirationTime).getTime();
    const currentTime = Date.now();
    if (tokenExpirationTime <= currentTime) {
      // Token is expired, force refresh the token
      await user.getIdToken(true);
    }

    return user;
  };

  useEffect(() => {
    const handleAuthStateChange = async (user: User | null) => {
      if (user) {
        const updatedUser = await checkTokenExpiry(user);
        setCurrentUser(updatedUser);
        try {
          const accessToken = await updatedUser?.getIdToken(true);
          const [allowedOrgs, isAdminResponse] = await Promise.all([
            getAllowedOrgs(accessToken),
            checkIsAdmin(accessToken),
          ]);
          setIsAdmin(!!isAdminResponse);
          setOrganisations({
            allowed: allowedOrgs,
            current: allowedOrgs[0], // TODO: Preserve current across reloads with Zustand
          });
        } catch (err) {
          console.error("Error fetching allowed orgs or admin status", err);
          setOrganisations(orgDefault);
        }
      } else {
        setCurrentUser(null);
        setOrganisations(orgDefault);
        setIsAdmin(false);
      }
      await initAuth();
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    const interval = setInterval(
      async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const updatedUser = await checkTokenExpiry(currentUser);
          setCurrentUser(updatedUser);
        }
      },
      5 * 60 * 1000
    ); // Check every 5 minutes

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        organisations,
        isAdmin,
        setOrganisations,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
