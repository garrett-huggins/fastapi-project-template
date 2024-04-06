import settings from "../../config/settings";
import { Box } from "@mui/material";
import { FormBox, FormScreenContainer } from "../../components/FormContainers";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import TextField from "@mui/material/TextField";
import { useAsync } from "@react-hookz/web";
import { forgotPassword } from "../../api/auth";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const { authenticated } = useAuth();
  const [forgotPasswordState, forgotPasswordActions] = useAsync(forgotPassword);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    forgotPasswordActions.execute(data.email);
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
        <h1 style={{ textAlign: "center" }}>Forgot Password</h1>
        <p>
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
        <TextField
          required
          {...register("email", { required: true })}
          label="Email"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.email ? true : false}
          helperText={errors.email ? "Email is required" : ""}
        />
        <Button
          type="submit"
          fullWidth
          disabled={forgotPasswordState.status === "loading"}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </FormBox>
      <Box color="GrayText">
        <p>© 2024 {settings.PROJECT_NAME} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default ForgotPassword;
