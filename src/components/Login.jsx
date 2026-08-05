import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import dotenv from "dotenv/config";

const Login = ({ onLogin, children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();
  const apiDomain = process.env.DOMAIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${apiDomain}/users/login`, { email, password });
      const { token } = res.data;
      onLogin(token);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={4} sx={{ p: 4, bgcolor: theme.palette.background.paper, borderRadius: 3, minWidth: 320 }}>
          <Typography variant="h5" color={theme.palette.text.primary} mb={2} fontWeight={theme.typography.fontWeightBold}>Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="filled"
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{ style: { color: theme.palette.text.primary } }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              sx={{ bgcolor: theme.palette.background.default }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="filled"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{ style: { color: theme.palette.text.primary } }}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              sx={{ bgcolor: theme.palette.background.default }}
            />
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: theme.palette.primary.main }}>Login</Button>
          </form>
          {children && <Box sx={{ textAlign: "center", mt: 2 }}>{children}</Box>}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;
