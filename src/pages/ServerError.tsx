import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
interface ServerErrorProps {
  message?: string;
}
const ServerError: React.FC<ServerErrorProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        gap: 4,
      }}
    >
      <Box
        sx={{
          width: { xs: "80%", sm: 400 },
          maxWidth: "100%",
          height: "auto",
        }}
      >
        <Box
          component="img"
          src="/server-error.png"
          alt="Server Down"
          sx={{
            width: "100%",
            maxHeight: 300,
            objectFit: "contain",
            display: { xs: "block", sm: "block" },
          }}
        />
      </Box>

      <Box
        display="flex"
        alignItems="center"
        gap={1}
        flexWrap="wrap"
        justifyContent="center"
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            color: "error.main",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          Oops! Something Went Wrong
        </Typography>
      </Box>

      {message ? (
        <Typography
          variant="body1"
          color="text.secondary"
          maxWidth={500}
          sx={{ px: 2 }}
        >
          {message}
        </Typography>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          maxWidth={500}
          sx={{ px: 2 }}
        >
          We’re having trouble connecting to the server right now.
          <br />
          Please try again in a moment or check your internet connection
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate(0)}
        sx={{
          textTransform: "none",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Retry
      </Button>
    </Container>
  );
};

export default ServerError;
