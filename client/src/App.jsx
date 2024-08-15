import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RegisteredUsers from "./components/RegisteredUser";
import TestList from "./components/TestList";
import MakeReport from "./components/MakeReport";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registered-users" element={<RegisteredUsers />} />
          <Route path="/test-list" element={ <TestList/> } />
          <Route path="/make-report" element={<MakeReport/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
