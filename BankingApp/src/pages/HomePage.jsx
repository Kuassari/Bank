import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Receipt } from '@mui/icons-material';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Bank Transactions System
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Welcome to the bank transactions management system
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Receipt />}
          onClick={() => navigate('/transactions')}
          sx={{ mt: 4 }}
        >
          View Transactions
        </Button>
      </Paper>
    </Container>
  );
}