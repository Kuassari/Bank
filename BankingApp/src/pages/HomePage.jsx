import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Receipt } from '@mui/icons-material';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Bank Transactions System
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
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
        </Box>
      </Paper>
    </Container>
  );
}

export default HomePage;