import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6}
        alignItems="center"
        justifyContent="center"
        textAlign={{ xs: "center", md: "left" }}
      >
        {/* Text Section */}
        <Box>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 2 }}
            color={theme.palette.primary.dark}
          >
            Lost in the Void?
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 480 }}
          >
            The page you're looking for isn't here anymore. It might have been
            moved, deleted, or never existed. But no worries—we’ll help you find
            your way back.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Image Section */}
        <Box
          component="img"
          // src="https://illustrations.popsy.co/violet/app-launch.svg"
          // src="./app-launch.svg"
          src="./not-found.webp"
          alt="404 Not Found Illustration"
          sx={{
            width: { xs: "100%", md: 400 },
            height: "auto",
          }}
        />
      </Stack>
    </Container>
  );
};

export default NotFound;
