import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  Stack,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from "@mui/material";
import { AttachFile, Send, Close } from '@mui/icons-material';
import api from "../api";

export default function Ask() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const uploadFiles = async () => {
    if (!files.length) return [];
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    const r = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return r.data.urls;
  };

  const submit = async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!body.trim()) {
      setError("Please describe your question");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const media = await uploadFiles();
      const r = await api.post("/questions", {
        title, body, tags: tags.split(",").map(s => s.trim()).filter(Boolean), media
      });
      nav(`/q/${r.data._id}`);
    } catch (err) {
      setError("Failed to post question. Please try again.");
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ask a Question
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get help from the community by asking a detailed question
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <TextField
            label="Question Title"
            placeholder="e.g., How do I implement authentication in React?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            variant="outlined"
            helperText="Be specific and imagine you're asking a question to another person"
          />

          <TextField
            label="Question Details"
            placeholder="Provide all the details about your question. Include what you've tried and what you're trying to achieve."
            value={body}
            onChange={e => setBody(e.target.value)}
            fullWidth
            required
            multiline
            rows={8}
            variant="outlined"
            helperText="The more details you provide, the better answers you'll get"
          />

          <TextField
            label="Tags"
            placeholder="e.g., react, javascript, authentication"
            value={tags}
            onChange={e => setTags(e.target.value)}
            fullWidth
            variant="outlined"
            helperText="Add up to 5 tags separated by commas to describe your question"
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              sx={{ mb: 2 }}
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
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {files.map((file, i) => (
                  <Chip
                    key={i}
                    label={file.name}
                    onDelete={() => removeFile(i)}
                    deleteIcon={<Close />}
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => nav('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
              size="large"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, p: 3, bgcolor: 'info.lighter', borderRadius: 2, border: 1, borderColor: 'info.light' }}>
        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
          Tips for getting good answers:
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
          <li>Make sure your question hasn't been asked before</li>
          <li>Keep your question focused and specific</li>
          <li>Include relevant code, error messages, or screenshots</li>
          <li>Describe what you've already tried</li>
        </Typography>
      </Box>
    </Box>
  );
}
