import project from "../../config/project";
import { Box } from "@mui/material";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { useAsync } from "@react-hookz/web";
import { forgotPassword } from "../../api/auth";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { FormTextField } from "../../components/forms/inputs";

interface FormData {
  email: string;
}

const ForgotPassword = () => {
  const { authenticated } = useAuth();
  const [forgotPasswordState, forgotPasswordActions] = useAsync(forgotPassword);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    forgotPasswordActions.execute(data.email);
    enqueueSnackbar("Success! Please check your email for the reset link.", {
      variant: "success",
    });
    navigate("/password/reset");
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
        <FormTextField
          required
          fullWidth
          label="Email"
          margin="normal"
          control={control}
          rules={{ required: "Email is required" }}
          name="email"
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
        <p>© 2024 {project.name} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default ForgotPassword;
