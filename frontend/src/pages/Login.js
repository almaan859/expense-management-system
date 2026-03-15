import React,{useState} from "react";
import API from "../api/api";

import {Container,TextField,Button,Typography,Box,Paper} from "@mui/material";

export default function Login({setUser}){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async()=>{

try{

const res = await API.post("/login",{email,password});

const token = res.data.token;

localStorage.setItem("token",token);

const payload = JSON.parse(atob(token.split(".")[1]));

setUser(payload.role);

}catch(err){

alert("Login failed");

}

};

return(

<Container maxWidth="sm">

<Paper elevation={4} style={{padding:40,marginTop:100}}>

<Typography variant="h4" gutterBottom>
Expense Management Login
</Typography>

<Box display="flex" flexDirection="column" gap={3}>

<TextField
label="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<TextField
type="password"
label="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<Button
variant="contained"
size="large"
onClick={login}
>
Login
</Button>

</Box>

</Paper>

</Container>

);

}