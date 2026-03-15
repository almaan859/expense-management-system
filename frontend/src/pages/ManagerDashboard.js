import React,{useEffect,useState} from "react";
import API from "../api/api";

import {Container,Typography,Table,TableHead,TableRow,TableCell,TableBody,Button,Paper} from "@mui/material";

export default function ManagerDashboard(){

const [expenses,setExpenses]=useState([]);

const token = localStorage.getItem("token");

const load = async()=>{

const res = await API.get("/expenses/pending",
{headers:{Authorization:`Bearer ${token}`}}
);

setExpenses(res.data);

};

const approve = async(id)=>{

await API.put(`/expenses/${id}/approve`,{},
{headers:{Authorization:`Bearer ${token}`}}
);

load();

};

useEffect(()=>{
load();
},[]);

return(

<Container>

<Typography variant="h4" style={{marginTop:40}}>
Manager Dashboard
</Typography>

<Paper style={{marginTop:30}}>

<Table>

<TableHead>
<TableRow>
<TableCell>ID</TableCell>
<TableCell>Amount</TableCell>
<TableCell>Category</TableCell>
<TableCell>Action</TableCell>
</TableRow>
</TableHead>

<TableBody>

{expenses.map(e=>(
<TableRow key={e.id}>
<TableCell>{e.id}</TableCell>
<TableCell>{e.amount}</TableCell>
<TableCell>{e.category}</TableCell>
<TableCell>

<Button
variant="contained"
onClick={()=>approve(e.id)}
>
Approve
</Button>

</TableCell>
</TableRow>
))}

</TableBody>

</Table>

</Paper>

</Container>

);

}
