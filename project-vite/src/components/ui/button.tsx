import { Button as MUIButton, ButtonProps } from "@mui/material";
import { styles } from "../../config/project";

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <MUIButton
      variant="contained"
      sx={{
        background: styles.primaryColor,
        ":hover": {
          brightness: 0.9,
        },
        fontWeight: "bold",
      }}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
