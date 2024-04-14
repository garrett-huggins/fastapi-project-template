import project from "../../config/project";
import { ArrowLeft } from "lucide-react";
import { Box, TextField } from "@mui/material";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import { useForm } from "react-hook-form";
import { useAsync } from "@react-hookz/web";
import { registerUser } from "../../api/auth";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

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
        <TextField
          required
          {...register("firstName", { required: "First Name is required" })}
          label="First Name"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.firstName ? true : false}
          helperText={errors.firstName?.message}
        />
        <TextField
          required
          {...register("lastName", { required: "Last Name is required" })}
          label="Last Name"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.lastName ? true : false}
          helperText={errors.lastName?.message}
        />
        <TextField
          required
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          })}
          label="Email"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.email ? true : false}
          helperText={errors.email?.message}
        />
        <TextField
          required
          {...register("password", { required: "Password is required" })}
          label="Password"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        />
        <TextField
          required
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          label="Confirm Password"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.confirmPassword ? true : false}
          helperText={errors.confirmPassword?.message}
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
