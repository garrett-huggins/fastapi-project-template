import settings from "../../config/settings";
import Link from "../../components/ui/link";
import Button from "../../components/ui/button";
import { Box, TextField } from "@mui/material";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login as APILogin } from "../../api/auth";
import { FormBox, FormScreenContainer } from "../../components/FormContainers";
import { useAuth } from "../../components/context/AuthContext";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { session, authenticated } = useAuth();
  const navigate = useNavigate();
  const [loginState, loginActions] = useAsync(APILogin);
  const [status, setStatus] = useState<"not-executed" | "loading">(
    "not-executed"
  );
  const [error, setError] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    // onSignIn(data.email, data.password);
    setError(false);
    loginActions.execute(data.email, data.password);
  });

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (loginState.status === "success" && loginState.result) {
      if (status === "not-executed") {
        setStatus("loading");
        session.create(loginState.result.access_token);
      }
    }
    if (loginState.status === "error") {
      setError(true);
    }
  }, [loginState, navigate, session, status]);

  return (
    <FormScreenContainer>
      <FormBox>
        <h1 style={{ textAlign: "center" }}>
          Sign In To {settings.PROJECT_NAME}
        </h1>
        {error && (
          <Box
            sx={{
              color: "red",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Invalid email or password
          </Box>
        )}
        <TextField
          required
          label="Email Address"
          type="email"
          sx={{ marginBottom: 2 }}
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          required
          label="Password"
          type="password"
          sx={{ marginBottom: 2 }}
          fullWidth
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          disabled={loginState.status === "loading" || status === "loading"}
          variant="contained"
          fullWidth
          onClick={onSubmit}
        >
          Sign In
        </Button>
        <p>
          Don't have an account? <Link href="/register">Sign Up</Link>
        </p>
        <p>
          <Link href="/password/forgot">Forgot Password?</Link>
        </p>
      </FormBox>
      <Box color="GrayText">
        <p>© 2024 {settings.PROJECT_NAME} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default Login;
