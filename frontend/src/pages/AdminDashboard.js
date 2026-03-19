import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";

export default function AdminDashboard() {
  const [limit, setLimit] = useState("");
  const [days, setDays] = useState("");
  const token = localStorage.getItem("token");

  const updateRules = async () => {
    await axios.put(
      "http://localhost:4000/admin/update-rules",
      {
        auto_approve_limit: limit,
        escalation_days: days,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Rules Updated");
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #000428, #004e92)",
      paddingTop: "40px"
    }}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 4 }}>
          Admin Dashboard
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Update System Rules
            </Typography>

            <TextField
              label="Auto Approve Limit"
              fullWidth
              sx={{ mb: 2 }}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <TextField
              label="Escalation Days"
              fullWidth
              sx={{ mb: 2 }}
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={updateRules}
            >
              UPDATE RULES
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}