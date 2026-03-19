import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from "@mui/material";

export default function ManagerDashboard() {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/expenses/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("DATA:", res.data); // debug

      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const approve = async (id) => {
    await axios.put(
      `http://localhost:4000/expenses/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchExpenses();
  };

  const reject = async (id) => {
    await axios.put(
      `http://localhost:4000/expenses/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchExpenses();
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #141e30, #243b55)",
      paddingTop: "40px"
    }}>
      <Container>
        <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 4 }}>
          Manager Dashboard
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h6">Pending Expenses</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Receipt</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>{exp.id}</TableCell>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.category}</TableCell>

                    <TableCell>
                      {exp.receipt && (
                        <img src={`http://localhost:4000/uploads/${exp.receipt}`} width="60" />
                      )}
                    </TableCell>

                    <TableCell>
                      <Button color="success" onClick={()=>approve(exp.id)}>Approve</Button>
                      <Button color="error" onClick={()=>reject(exp.id)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}