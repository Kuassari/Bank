import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Box>
          <Typography variant="h1" gutterBottom color="primary">
            404
          </Typography>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for does not exist
          </Typography>
          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}