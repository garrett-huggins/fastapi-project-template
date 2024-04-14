import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Page404 />} />
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />

          {/* Session Routes */}
          <Route element={<ProtectedRoute />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
