import { Box } from "@mui/material";

export const FormBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="block"
      maxWidth={800}
      width="100%"
      sx={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 1px 1px 1px #ccc",
      }}
    >
      {children}
    </Box>
  );
};

export const FormScreenContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      component="form"
      noValidate
      autoComplete="off"
      sx={{ background: "#f5f5f5" }}
    >
      {children}
    </Box>
  );
};
