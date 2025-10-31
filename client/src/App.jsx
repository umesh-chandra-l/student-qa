import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { 
  ThemeProvider, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box,
  Avatar,
  Typography,
  IconButton
} from "@mui/material";
import { QuestionAnswer, Home, Add, Person } from '@mui/icons-material';
import Feed from "./pages/Feed";
import Ask from "./pages/Ask";
import Question from "./pages/Question";
import Profile from "./pages/Profile";
import api from "./api";
import { useEffect, useState } from "react";
import theme from "./theme";

function Nav({ user }) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuestionAnswer sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" component={RouterLink} to="/" sx={{ 
            textDecoration: 'none', 
            color: 'text.primary',
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' }
          }}>
            Student Q&A
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            component={RouterLink} 
            to="/" 
            startIcon={<Home />}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            Home
          </Button>
          <Button 
            component={RouterLink} 
            to="/ask" 
            variant="contained"
            startIcon={<Add />}
          >
            Ask Question
          </Button>
          {user ? (
            <IconButton component={RouterLink} to="/profile" sx={{ p: 0.5 }}>
              <Avatar 
                src={user.profilePic} 
                alt={user.name}
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
          ) : (
            <Button 
              variant="outlined"
              href="http://localhost:5000/api/auth/google"
              startIcon={<Person />}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => { api.get("/auth/me").then(r => setUser(r.data)).catch(() => {}); }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Nav user={user} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Feed user={user} />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/q/:id" element={<Question user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
