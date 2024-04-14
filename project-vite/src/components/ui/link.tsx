import { Link as MUILink, LinkProps } from "@mui/material";
import { styles } from "../../config/project";

/**
 * Custom Link component with primary color and hover state.
 *
 * Extends MUI Link.
 *
 */
export const Link = ({ children, ...props }: LinkProps) => {
  return (
    <MUILink
      sx={{
        color: styles.primaryColor,
        ":hover": {
          color: `${styles.primaryColor}99`,
        },
      }}
      {...props}
    >
      {children}
    </MUILink>
  );
};

export default Link;
