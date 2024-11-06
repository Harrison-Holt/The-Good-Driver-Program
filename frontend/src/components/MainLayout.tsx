// src/components/MainLayout.tsx
import React from "react";
import Navibar from "./Navibar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const MainLayout: React.FC = () => {
  return (
    <>
      <Navibar />
      <Box component="main" sx={{ padding: 2, marginTop: 8 }}> {/* Adjust `marginTop` as needed */}
        <Outlet /> {/* This renders the current route's component */}
      </Box>
    </>
  );
};

export default MainLayout;
