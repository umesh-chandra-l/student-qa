import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardActionArea,
  TextField, 
  Box, 
  Typography, 
  Avatar, 
  Chip,
  Stack,
  Paper,
  InputAdornment,
  Skeleton,
  Grid
} from "@mui/material";
import { Search, FilterList } from '@mui/icons-material';
import api from "../api";

export default function Feed() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/questions", { params: { q, tag } })
      .then(r => setList(r.data))
      .finally(() => setLoading(false));
  }, [q, tag]);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Find answers to your questions or ask a new one
        </Typography>
        
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                placeholder="Search questions..." 
                value={q} 
                onChange={e => setQ(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
                size="medium"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                placeholder="Filter by tag..." 
                value={tag} 
                onChange={e => setTag(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList color="action" />
                    </InputAdornment>
                  ),
                }}
                size="medium"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Stack spacing={2}>
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="text" width="30%" />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : list.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No questions found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or ask a new question
            </Typography>
          </Paper>
        ) : (
          list.map(it => (
            <Card key={it._id}>
              <CardActionArea component={RouterLink} to={`/q/${it._id}`}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: 'text.primary' }}>
                    {it.title}
                  </Typography>
                  
                  {it.tags && it.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {it.tags.map(t => (
                        <Chip 
                          key={t} 
                          label={t} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      src={it.user?.profilePic} 
                      alt={it.user?.name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {it.user?.name || 'Anonymous'}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
