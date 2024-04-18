import project from "../../config/project";
import { ArrowLeft } from "lucide-react";
import { Box } from "@mui/material";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import { useForm } from "react-hook-form";
import { useAsync } from "@react-hookz/web";
import { registerUser } from "../../api/auth";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FormTextField } from "../../components/forms/inputs";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { authenticated } = useAuth();
  const [registerState, registerActions] = useAsync(registerUser);
  const navigate = useNavigate();

  const { control, handleSubmit, watch } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    registerActions.execute({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    });
  });

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  return (
    <FormScreenContainer>
      <FormBox>
        <Link href="/login">
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 style={{ textAlign: "center" }}>Sign Up</h1>
        <p>
          Welcome to {project.name}. Please enter your details below to create
          an account.
        </p>
        <FormTextField
          required
          fullWidth
          label="First Name"
          margin="normal"
          control={control}
          rules={{ required: "First Name is required" }}
          name="firstName"
        />
        <FormTextField
          required
          fullWidth
          label="Last Name"
          margin="normal"
          control={control}
          rules={{ required: "Last Name is required" }}
          name="lastName"
        />
        <FormTextField
          required
          fullWidth
          label="Email"
          margin="normal"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          }}
          name="email"
        />
        <FormTextField
          required
          fullWidth
          label="Password"
          margin="normal"
          control={control}
          rules={{ required: "Password is required" }}
          name="password"
          type="password"
        />
        <FormTextField
          required
          fullWidth
          label="Confirm Password"
          margin="normal"
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
          name="confirmPassword"
          type="password"
        />

        <Button
          type="submit"
          fullWidth
          disabled={registerState.status === "loading"}
          onClick={onSubmit}
        >
          Sign Up
        </Button>
      </FormBox>
      <Box color="GrayText">
        <p>© 2024 {project.name} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default Register;
