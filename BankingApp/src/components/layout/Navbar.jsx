import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AccountBalance, Home, Receipt } from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalance sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bank Transactions
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<Receipt />}
            onClick={() => navigate('/transactions')}
          >
            Transactions
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;