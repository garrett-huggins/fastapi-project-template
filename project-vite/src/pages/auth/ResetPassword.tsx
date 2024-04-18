import project from "../../config/project";
import { Box } from "@mui/material";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { resetPassword } from "../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FormTextField } from "../../components/forms/inputs";

interface FormData {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPassword = () => {
  const { authenticated } = useAuth();
  const [resetPasswordState, resetPasswordActions] = useAsync(resetPassword);
  const navigate = useNavigate();

  const { control, watch, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    resetPasswordActions.execute({
      token: data.resetToken,
      new_password: data.newPassword,
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
        <h1 style={{ textAlign: "center" }}>Reset Password</h1>
        <p>
          Enter the reset token and your new password below to reset your
          password.
        </p>
        <FormTextField
          required
          fullWidth
          label="Reset Token"
          margin="normal"
          control={control}
          rules={{ required: "Reset Token is required" }}
          name="resetToken"
        />
        <FormTextField
          required
          fullWidth
          label="New Password"
          margin="normal"
          control={control}
          rules={{ required: "New Password is required" }}
          name="newPassword"
        />
        <FormTextField
          required
          fullWidth
          label="Confirm New Password"
          margin="normal"
          control={control}
          rules={{
            required: "Confirm New Password is required",
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          }}
          name="confirmNewPassword"
        />
        <Button
          type="submit"
          fullWidth
          disabled={resetPasswordState.status === "loading"}
          onClick={onSubmit}
        >
          Reset Password
        </Button>
        <p>
          <Link href="/login">Back to Sign In</Link>
        </p>
      </FormBox>
      <Box color="GrayText">
        <p>© 2024 {project.name} - Terms of Use</p>
      </Box>
    </FormScreenContainer>
  );
};

export default ResetPassword;
