import React,{useState} from "react";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App(){

const [user,setUser] = useState(null);

if(!user){
return <Login setUser={setUser}/>
}

if(user==="employee"){
return <EmployeeDashboard/>
}

if(user==="manager"){
return <ManagerDashboard/>
}

if(user==="admin"){
return <AdminDashboard/>
}

}
