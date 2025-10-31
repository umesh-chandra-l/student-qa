import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  TextField,
  Card,
  CardContent,
  Stack,
  Divider,
  Alert,
  Chip,
  Grid
} from "@mui/material";
import { 
  Edit, 
  Save, 
  Logout, 
  Email, 
  EmojiEvents,
  AccountCircle 
} from '@mui/icons-material';
import api from "../api";

export default function Profile({ user, setUser }) {
  const [ach, setAch] = useState((user?.achievements||[]).join(", "));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  useEffect(() => { 
    setAch((user?.achievements||[]).join(", ")); 
  }, [user]);

  const save = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const r = await api.patch("/auth/me/achievements", { 
        achievements: ach.split(",").map(s => s.trim()).filter(Boolean) 
      });
      setUser(r.data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };
  
  const logout = async () => { 
    await api.post("/auth/logout"); 
    nav("/"); 
    window.location.reload(); 
  };

  if (!user) {
    return (
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <AccountCircle sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Please log in to view your profile
        </Typography>
        <Button 
          variant="contained" 
          href="http://localhost:5000/api/auth/google"
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account information and achievements
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar 
                src={user.profilePic} 
                alt={user.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  border: 4,
                  borderColor: 'primary.main'
                }}
              />
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary' }}>
                <Email fontSize="small" />
                <Typography variant="body2">
                  {user.email}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<Logout />}
                onClick={logout}
                fullWidth
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents sx={{ color: 'warning.main', fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="600">
                    Achievements
                  </Typography>
                </Box>
                {!editing && (
                  <Button 
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Achievements updated successfully!
                </Alert>
              )}

              {editing ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={ach}
                    onChange={e => setAch(e.target.value)}
                    placeholder="e.g., Internship @ Google, Hackathon Winner, Dean's List"
                    helperText="Separate multiple achievements with commas"
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined"
                      onClick={() => {
                        setEditing(false);
                        setAch((user?.achievements||[]).join(", "));
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained"
                      startIcon={<Save />}
                      onClick={save}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Stack>
              ) : (
                <Box>
                  {user.achievements && user.achievements.length > 0 ? (
                    <Stack spacing={1.5}>
                      {user.achievements.map((achievement, i) => (
                        <Box 
                          key={i}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            }
                          }}
                        >
                          <EmojiEvents sx={{ color: 'warning.main' }} />
                          <Typography variant="body1">
                            {achievement}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                      <Typography variant="body2" color="text.secondary">
                        No achievements added yet. Click Edit to add your achievements!
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                💡 Showcase Your Expertise
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adding achievements helps others understand your background and expertise. Consider including:
              </Typography>
              <Stack spacing={1}>
                {[
                  'Academic achievements (Dean\'s List, scholarships)',
                  'Work experience (internships, jobs)',
                  'Competition wins (hackathons, contests)',
                  'Certifications and courses',
                  'Projects and contributions'
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="body2" color="primary">•</Typography>
                    <Typography variant="body2" color="text.secondary">{tip}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
