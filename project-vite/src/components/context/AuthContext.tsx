import { useAsync } from "@react-hookz/web";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser, getProfile } from "../../api/profile";

// TODO: remove console logs

export type AuthContextType = {
  authenticated: boolean;
  session: {
    create: (token: string) => void;
    end: () => void;
    refresh: () => void;
  };
  user: IUser | null;
};

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  session: {
    create: () => {},
    end: () => {},
    refresh: () => {},
  },
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [mounted, setMounted] = useState(false);

  // api
  const [profileState, profileActions] = useAsync(getProfile);
  const [refreshState, refreshActions] = useAsync(getProfile);

  // handle profile
  useEffect(() => {
    if (!isAuthenticated) {
      if (profileState.status === "success" && profileState.result) {
        setUser(profileState.result);
        setIsAuthenticated(true);
      }
    }
  }, [profileState, isAuthenticated, mounted]);

  // initial check
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      if (profileState.status === "not-executed") {
        profileActions.execute();
      }
    } else {
      setIsAuthenticated(false);
      setMounted(true);
    }
  }, [profileActions, profileState]);

  const handleAuthentication = (authenticated: boolean) => {
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setMounted(true);
  };

  useEffect(() => {
    if (profileState.status === "success" && profileState.result) {
      handleAuthentication(true);
    }
    if (profileState.status === "error") {
      handleAuthentication(false);
    }
  }, [profileState.status, profileState.result]);

  useEffect(() => {
    if (refreshState.status === "success" && refreshState.result) {
      setUser(refreshState.result);
    }
    if (refreshState.status === "error") {
      setIsAuthenticated(false);
    }
  }, [refreshState]);

  const createSession = async (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
    profileActions.execute();
  };

  const endSession = () => {
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setUser(null);
    profileActions.execute();
  };

  const refreshSession = async () => {
    setUser(null);
    refreshActions.execute();
  };

  const session = {
    create: createSession,
    end: endSession,
    refresh: refreshSession,
  };

  const value = {
    authenticated: isAuthenticated,
    session,
    user,
  };

  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
