import project from "../../config/project";
import Link from "../../components/ui/link";
import Button from "../../components/ui/button";
import { Box } from "@mui/material";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login as APILogin } from "../../api/auth";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import { useAuth } from "../../components/context/AuthContext";
import { FormTextField } from "../../components/forms/inputs";

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

  const { handleSubmit, control } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
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
        <h1 style={{ textAlign: "center" }}>Sign In To {project.name}</h1>
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
        <FormTextField
          label="Email Address"
          margin="normal"
          required
          fullWidth
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          }}
          name={"email"}
        />
        <FormTextField
          label="Password"
          margin="normal"
          required
          fullWidth
          control={control}
          rules={{ required: "Password is required" }}
          name={"password"}
          type={"password"}
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
        <p>© 2024 {project.name} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default Login;
