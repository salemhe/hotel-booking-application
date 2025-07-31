import React from "react";
import { ReservationsTable } from "../components/ReservationsTable";
import { Container, Typography } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

const InhouseReservationsPage: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      In-House Reservations (Real-Time)
    </Typography>
    <ReservationsTable
      apiUrl={API_URL}
      socketUrl={SOCKET_URL}
      filterType="in-house"
    />
  </Container>
);

export default InhouseReservationsPage;