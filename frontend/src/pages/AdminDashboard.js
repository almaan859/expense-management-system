import React,{useState} from "react";
import API from "../api/api";

import {Container,Typography,TextField,Button,Paper,Box} from "@mui/material";

export default function AdminDashboard(){

const [limit,setLimit]=useState("");
const [days,setDays]=useState("");

const token = localStorage.getItem("token");

const updateRules = async()=>{

await API.put("/admin/update-rules",
{
auto_approve_limit:limit,
escalation_days:days
},
{
headers:{Authorization:`Bearer ${token}`}
});

alert("Rules Updated");

};

return(

<Container>

<Typography variant="h4" style={{marginTop:40}}>
Admin Dashboard
</Typography>

<Paper style={{padding:30,marginTop:30}}>

<Typography variant="h6">
System Rules
</Typography>

<Box display="flex" gap={3} marginTop={3}>

<TextField
label="Auto Approve Limit"
value={limit}
onChange={e=>setLimit(e.target.value)}
/>

<TextField
label="Escalation Days"
value={days}
onChange={e=>setDays(e.target.value)}
/>

<Button
variant="contained"
onClick={updateRules}
>
Update
</Button>

</Box>

</Paper>

</Container>

);

}