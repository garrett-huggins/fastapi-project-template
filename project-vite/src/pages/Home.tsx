import { Typography, Button } from "@mui/material";
import { useAuth } from "../components/context/AuthContext";

const Home = () => {
  const { session, authenticated, user } = useAuth();

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography fontSize="2rem" fontWeight="bold">
        Home
      </Typography>
      {authenticated ? (
        <>
          <Typography textAlign="center" fontSize="1.5rem">
            Welcome, {user?.first_name}!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => session.end()}
          >
            Logout
          </Button>
        </>
      ) : (
        <Typography textAlign="center" fontSize="1.5rem">
          You are not authenticated, <a href="/login">login</a>.
        </Typography>
      )}
    </main>
  );
};

export default Home;
