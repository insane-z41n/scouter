import React, { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Scouter from "./components/Scouter"; // Assuming Scouter is a component that displays the JWT token

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#181A20",
      paper: "#23272F"
    },
    primary: {
      main: "#3B4252"
    },
    text: {
      primary: "#fff"
    }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontWeightBold: 700
  }
});


const AppRoutes = ({ token, setToken }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate("/scouter");
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={
        <Login onLogin={setToken}>
          <Link to="/register" style={{ background: "none", color: darkTheme.palette.text.primary, border: "none", cursor: "pointer" }}>Don't have an account? Register</Link>
        </Login>
      } />
      <Route path="/register" element={
        <Register onRegister={() => window.location.replace('/login')}>
          <Link to="/login" style={{ background: "none", color: darkTheme.palette.text.primary, border: "none", cursor: "pointer" }}>Already have an account? Login</Link>
        </Register>
      } />
      <Route path="/scouter" element={token ? <Scouter token={token} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={token ? "/scouter" : "/login"} />} />
    </Routes>
  );
};

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppRoutes token={token} setToken={setToken} />
      </Router>
    </ThemeProvider>
  );
};

export default App;
