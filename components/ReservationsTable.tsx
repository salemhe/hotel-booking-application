import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Collapse, Box, Typography, CircularProgress
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Reservation, useReservationsSocket } from "@/hooks/useReservationSocket";

interface ReservationsTableProps {
  apiUrl: string;
  socketUrl: string;
  filterType?: "in-house" | "external";
}

const Row: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{reservation.guestName}</TableCell>
        <TableCell>{reservation.type}</TableCell>
        <TableCell>{reservation.meals?.length || 0}</TableCell>
        <TableCell>{reservation.rooms?.length || 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1">Meals:</Typography>
              <ul>
                {reservation.meals && reservation.meals.length > 0
                  ? reservation.meals.map((meal, idx) => (
                      <li key={idx}>{meal}</li>
                    ))
                  : <li>No meals</li>}
              </ul>
              <Typography variant="subtitle1">Rooms:</Typography>
              <ul>
                {reservation.rooms && reservation.rooms.length > 0
                  ? reservation.rooms.map((room, idx) => (
                      <li key={idx}>{room}</li>
                    ))
                  : <li>No rooms</li>}
              </ul>
              {/* Add more details as needed */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  apiUrl,
  socketUrl,
  filterType,
}) => {
  const { reservations, loading } = useReservationsSocket(apiUrl, socketUrl);

  const filtered = filterType
    ? reservations.filter((r) => r.type === filterType)
    : reservations;

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Guest Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Meals</TableCell>
            <TableCell>Rooms</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((reservation) => (
            <Row key={reservation.id} reservation={reservation} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};