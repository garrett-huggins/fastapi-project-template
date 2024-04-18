import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router";
import { useEffect } from "react";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/context/ProtectedRoute";
import {
  Home,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Page404,
} from "./pages";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SentryRoutes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Page404 />} />
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />

          {/* Session Routes */}
          <Route element={<ProtectedRoute />}></Route>
        </SentryRoutes>
      </AuthProvider>
    </Router>
  );
};

export default App;
