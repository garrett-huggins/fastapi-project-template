import { useAsync } from "@react-hookz/web";
import axios from "axios";
import { SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { refreshTokenRequest } from "../../api/auth";
import { UserModel, getUser } from "../../api/profile";

// Prevent hiding the splash screen after the navigation has mounted
SplashScreen.preventAutoHideAsync();

interface AuthContextProps {
  authenticated: boolean;
  user: UserModel;
  session: {
    create: (token: string, refresh_token: string) => void;
    load: () => void;
    end: () => void;
    refresh: () => void;
    refreshToken: () => void;
  };
}

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const AuthContext = createContext<AuthContextProps>(null!);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [userRequest, userActions] = useAsync(async () => {
    const response = await getUser();
    return response;
  });

  const [refreshRequest, refreshActions] = useAsync(async () => {
    const response = await getUser();
    return response;
  });

  const [tokenRequest, tokenActions] = useAsync(async (refreshToken: any) => {
    const response = await refreshTokenRequest(refreshToken);
    return response;
  });

  const [authenticated, setAuthenticated] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  // axios interceptors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401 && authenticated) {
        setAuthenticated(false);
        axios.defaults.headers.common["Authorization"] = "";
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
      return Promise.reject(error);
    }
  );

  const handleAuthentication = (authenticated: boolean) => {
    if (authenticated) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setInitialLoad(true);
  };

  const setAuthTokens = async (token: string, refresh_token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, tokenRequest.result.access_token);
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      tokenRequest.result.refresh_token
    );
  };

  const loadSession = async () => {
    console.log("loading session");
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      userActions.execute();
    } else {
      axios.defaults.headers.common["Authorization"] = "";
      userActions.execute();
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return;
    }
    tokenActions.execute(refreshToken);
  };

  const refreshSession = async () => {
    refreshActions.execute();
  };

  const endSession = async () => {
    axios.defaults.headers.common["Authorization"] = "";
    await Promise.all([
      await SecureStore.deleteItemAsync(TOKEN_KEY),
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]).then(() => {
      loadSession();
    });
  };

  const createSession = async (token: string, refresh_token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
    loadSession();
  };

  const session = {
    load: loadSession,
    end: endSession,
    create: createSession,
    refresh: refreshSession,
    refreshToken: refreshAccessToken,
  };

  useEffect(() => {
    if (userRequest.status === "not-executed" && !userRequest.result) {
      loadSession();
    }
  }, []);

  useEffect(() => {
    if (userRequest.status === "success" && userRequest.result) {
      handleAuthentication(true);
    } else {
      handleAuthentication(false);
    }
  }, [userRequest.status, userRequest.result]);

  useEffect(() => {
    if (tokenRequest.status === "success" && tokenRequest.result) {
      setAuthTokens(
        tokenRequest.result.access_token,
        tokenRequest.result.refresh_token
      );
    } else if (tokenRequest.status === "error") {
      endSession();
    }
  }, [tokenRequest.status, tokenRequest.result]);

  // only show loading screen once on initial load (need to set a 1 time state)
  useEffect(() => {
    if (userRequest.status !== "loading" && initialLoad) {
      SplashScreen.hideAsync();
    }
  }, [userRequest.status]);

  const value = {
    authenticated: authenticated,
    user: (refreshRequest.result
      ? refreshRequest.result
      : userRequest.result) as UserModel,
    session: session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
