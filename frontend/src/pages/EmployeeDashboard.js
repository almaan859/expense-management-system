import React,{useState,useEffect} from "react";
import API from "../api/api";

import {Container,TextField,Button,Typography,Table,TableHead,TableRow,TableCell,TableBody,Paper,Box} from "@mui/material";

export default function EmployeeDashboard(){

const [amount,setAmount]=useState("");
const [category,setCategory]=useState("");
const [description,setDescription]=useState("");
const [expenses,setExpenses]=useState([]);

const token = localStorage.getItem("token");

const submitExpense = async()=>{

await API.post("/expenses",
{amount,category,description},
{headers:{Authorization:`Bearer ${token}`}}
);

loadExpenses();

};

const loadExpenses = async()=>{

const res = await API.get("/expenses/my",
{headers:{Authorization:`Bearer ${token}`}}
);

setExpenses(res.data);

};

useEffect(()=>{
loadExpenses();
},[]);

return(

<Container>

<Typography variant="h4" style={{marginTop:40}}>
Employee Dashboard
</Typography>

<Paper style={{padding:20,marginTop:30}}>

<Typography variant="h6">
Submit Expense
</Typography>

<Box display="flex" gap={2} marginTop={2}>

<TextField label="Amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
<TextField label="Category" value={category} onChange={e=>setCategory(e.target.value)}/>
<TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)}/>

<Button variant="contained" onClick={submitExpense}>
Submit
</Button>

</Box>

</Paper>

<Paper style={{marginTop:40}}>

<Table>

<TableHead>
<TableRow>
<TableCell>ID</TableCell>
<TableCell>Amount</TableCell>
<TableCell>Category</TableCell>
<TableCell>Status</TableCell>
</TableRow>
</TableHead>

<TableBody>

{expenses.map(exp=>(
<TableRow key={exp.id}>
<TableCell>{exp.id}</TableCell>
<TableCell>{exp.amount}</TableCell>
<TableCell>{exp.category}</TableCell>
<TableCell>{exp.status}</TableCell>
</TableRow>
))}

</TableBody>

</Table>

</Paper>

</Container>

);

}