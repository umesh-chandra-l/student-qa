import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Chip, 
  Button, 
  TextField,
  Stack,
  Card,
  CardContent,
  IconButton,
  Divider,
  CircularProgress,
  Link,
  Skeleton,
  Alert
} from "@mui/material";
import { 
  ThumbUp, 
  ThumbUpOutlined, 
  Send, 
  AttachFile,
  Link as LinkIcon,
  Close,
  EmojiEvents
} from '@mui/icons-material';
import api from "../api";

export default function Question({ user }) {
  const { id } = useParams();
  const [q, setQ] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        api.get(`/questions/${id}`),
        api.get(`/answers/by-question/${id}`)
      ]);
      setQ(a.data); 
      setAnswers(b.data);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { load(); }, [id]);

  const uploadFiles = async () => {
    if (!files.length) return [];
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    const r = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return r.data.urls;
  };

  const submit = async () => {
    if (!body.trim()) return;
    
    setSubmitting(true);
    try {
      const media = await uploadFiles();
      await api.post("/answers", { question: id, body, media });
      setBody(""); 
      setFiles([]); 
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUpvote = async (aid) => {
    try {
      const r = await api.post(`/answers/${aid}/upvote`);
      setAnswers(a => a.map(x => x._id === aid ? { ...x, upvoteCount: r.data.upvotes } : x));
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="70%" height={48} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={32} sx={{ mt: 3 }} />
        <Skeleton variant="rectangular" height={150} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!q) return <Alert severity="error">Question not found</Alert>;

  return (
    <Box>
      {/* Question Card */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {q.title}
        </Typography>
        
        {q.tags && q.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {q.tags.map(t => (
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
        
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {q.body}
        </Typography>
        
        {q.media && q.media.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            {q.media.map(u => (
              <Link 
                key={u} 
                href={u} 
                target="_blank" 
                rel="noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LinkIcon fontSize="small" />
                {u.split('/').pop()}
              </Link>
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Avatar 
            src={q.user?.profilePic} 
            alt={q.user?.name}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="body2" fontWeight="600">
              {q.user?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Asked this question
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Answers Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </Typography>
        
        <Stack spacing={2}>
          {answers.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No answers yet. Be the first to answer!
              </Typography>
            </Paper>
          ) : (
            answers.map(a => (
              <Card key={a._id}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Upvote section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                      <IconButton 
                        onClick={() => toggleUpvote(a._id)}
                        disabled={!user}
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.lighter' } }}
                      >
                        <ThumbUpOutlined />
                      </IconButton>
                      <Typography variant="h6" fontWeight="600">
                        {a.upvoteCount || 0}
                      </Typography>
                    </Box>
                    
                    {/* Answer content */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar 
                          src={a.user?.profilePic} 
                          sx={{ width: 32, height: 32 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {a.user?.name || 'Anonymous'}
                          </Typography>
                          {a.user?.achievements && a.user.achievements.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                              <EmojiEvents sx={{ fontSize: 14, color: 'warning.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {a.user.achievements.join(' • ')}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                        {a.body}
                      </Typography>
                      
                      {a.media && a.media.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {a.media.map(u => (
                            <Link 
                              key={u} 
                              href={u} 
                              target="_blank" 
                              rel="noreferrer"
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <LinkIcon fontSize="small" />
                              {u.split('/').pop()}
                            </Link>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>

      {/* Answer Form */}
      {user ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Your Answer
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Write your answer here. Be clear and detailed to help others."
              value={body}
              onChange={e => setBody(e.target.value)}
              variant="outlined"
            />
            
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFile />}
                size="small"
              >
                Attach Files
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={e => setFiles([...files, ...e.target.files])}
                />
              </Button>
              
              {files.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                  {files.map((file, i) => (
                    <Chip
                      key={i}
                      label={file.name}
                      onDelete={() => removeFile(i)}
                      deleteIcon={<Close />}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={submit}
                disabled={!body.trim() || submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                size="large"
              >
                {submitting ? 'Posting...' : 'Post Answer'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Please log in to post an answer
          </Typography>
          <Button 
            variant="contained" 
            href="http://localhost:5000/api/auth/google"
            sx={{ mt: 2 }}
          >
            Login with Google
          </Button>
        </Paper>
      )}
    </Box>
  );
}
