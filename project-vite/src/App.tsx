import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { Home, Login, Register, ForgotPassword, ResetPassword } from "./pages";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

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
