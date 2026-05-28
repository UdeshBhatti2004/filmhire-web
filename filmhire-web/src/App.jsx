import React from "react";
import {Routes} from "react-router-dom"
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleSelect from "./pages/auth/RoleSelect";

function App() {
  return <>
  
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/select-role" element={<RoleSelect />} />
      
  </Routes>

  </>;
}

export default App;
