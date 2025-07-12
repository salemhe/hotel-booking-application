"use client";

import React from "react";
import Link from "next/link";
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReportIcon from "@mui/icons-material/Report";
// import BuildIcon from "@mui/icons-material/Build";

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/super-admin/dashboard" },
  { text: "Vendors", icon: <BusinessIcon />, href: "/super-admin/vendors" },
  { text: "Chains", icon: <BusinessIcon />, href: "/super-admin/chains" },
  { text: "Locations", icon: <LocationOnIcon />, href: "/super-admin/locations" },
  { text: "Earnings", icon: <MonetizationOnIcon />, href: "/super-admin/earnings" },
  { text: "Revenue", icon: <BarChartIcon />, href: "/super-admin/revenue" },
  { text: "Reports", icon: <ReportIcon />, href: "/super-admin/reports" },
];

function SuperAdminSidebar() {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "background.paper",
        color: 'text.primary',
        height: '100vh',
        borderRight: 1,
        borderColor: 'divider',
        position: 'fixed',
        zIndex: 100,
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        {/* Replace src with your logo path if available */}
        {/* <img src="/logo.png" alt="Logo" style={{ maxHeight: 48, maxWidth: '80%' }} onError={e => { e.target.style.display = 'none'; }} /> */}
        <Image src="/logo.png" alt="Logo" width={120} height={48} style={{ maxHeight: 48, maxWidth: '80%' }} />
        {/* <span style={{ fontWeight: 'bold', fontSize: 24 }}>LOGO</span> */}
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem type="button" key={item.text} component={Link} href={item.href}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
}

export default SuperAdminSidebar;
