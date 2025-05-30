import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import { Box } from "@mui/material";
import { SideBar } from "../components/SideBar";
import { AddButton } from "../components/AddButton";
import { Outlet } from "react-router-dom";

export const DefaultLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <>
      <NavBar onMenuClick={handleDrawerToggle} />
      <Box sx={{ display: "flex" }}>
        <SideBar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box
          sx={{
            flex: 1,
            ml: { sm: "220px" },
            width: "100%",
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <AddButton />
    </>
  );
};
