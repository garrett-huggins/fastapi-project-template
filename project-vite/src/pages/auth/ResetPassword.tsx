import project from "../../config/project";
import { Box, TextField } from "@mui/material";
import { FormBox, FormScreenContainer } from "../../components/forms/container";
import Button from "../../components/ui/button";
import Link from "../../components/ui/link";
import { resetPassword } from "../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData {
  resetToken: string;
  newPassword: string;
}

const ResetPassword = () => {
  const { authenticated } = useAuth();
  const [resetPasswordState, resetPasswordActions] = useAsync(resetPassword);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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
        <TextField
          required
          {...register("resetToken", { required: "Reset Token is required" })}
          label="Reset Token"
          fullWidth
          variant="outlined"
          margin="normal"
          error={errors.resetToken ? true : false}
          helperText={errors.resetToken?.message}
        />
        <TextField
          required
          {...register("newPassword", { required: "New Password is required" })}
          label="New Password"
          fullWidth
          type="password"
          variant="outlined"
          margin="normal"
          error={errors.newPassword ? true : false}
          helperText={errors.newPassword?.message}
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
