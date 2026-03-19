import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

export default function EmployeeDashboard() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/expenses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const submitExpense = async () => {
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("receipt", file);

      await axios.post(
        "http://localhost:4000/expenses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAmount("");
      setCategory("");
      setDescription("");
      setFile(null);

      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Error submitting expense");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      paddingTop: "40px",
    }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 4 }}>
          Employee Dashboard
        </Typography>

        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Typography variant="h6">Submit Expense</Typography>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={3}>
                <TextField label="Amount" fullWidth value={amount} onChange={(e)=>setAmount(e.target.value)} />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Category" fullWidth value={category} onChange={(e)=>setCategory(e.target.value)} />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Description" fullWidth value={description} onChange={(e)=>setDescription(e.target.value)} />
              </Grid>
              <Grid item xs={3}>
                <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
              </Grid>
            </Grid>

            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={submitExpense}>
              SUBMIT
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6">Your Expenses</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Receipt</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>{exp.id}</TableCell>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.status}</TableCell>
                    <TableCell>
                      {exp.receipt && (
                        <img src={`http://localhost:4000/uploads/${exp.receipt}`} width="60" />
                      )}
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