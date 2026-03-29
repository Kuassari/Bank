import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { TransactionDialog } from '../components/TransactionDialog';
import { transactionsApi } from '../services/api';
import { MESSAGES } from '../constants/messages';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getAll();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showSnackbar(
        error.response?.data?.message || MESSAGES.ERROR.FETCH_FAILED,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateClick = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleCancelClick = async (id) => {
    if (!window.confirm(MESSAGES.CONFIRM.CANCEL_TRANSACTION)) {
      return;
    }

    try {
      await transactionsApi.cancel(id);
      showSnackbar(MESSAGES.SUCCESS.TRANSACTION_CANCELLED, 'success');
      fetchTransactions();
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      showSnackbar(
        error.response?.data?.message || MESSAGES.ERROR.CANCEL_FAILED,
        'error'
      );
    }
  };

  const handleDialogSubmit = async (payload, isEditMode, transactionId) => {
    try {
      if (isEditMode) {
        await transactionsApi.update(transactionId, payload);
        showSnackbar(MESSAGES.SUCCESS.TRANSACTION_UPDATED, 'success');
      } else {
        await transactionsApi.create(payload);
        showSnackbar(MESSAGES.SUCCESS.TRANSACTION_CREATED, 'success');
      }

      setDialogOpen(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      const errorMessage =
        error.response?.data?.message ||
        (isEditMode
          ? MESSAGES.ERROR.UPDATE_FAILED
          : MESSAGES.ERROR.CREATE_FAILED);
      showSnackbar(errorMessage, 'error');
      throw error;
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fullNameHebrew', headerName: 'Full Name (Hebrew)', width: 150 },
    { field: 'fullNameEnglish', headerName: 'Full Name (English)', width: 150 },
    { field: 'idNumber', headerName: 'ID Number', width: 120 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: (value) => {
        const amount = value ?? 0;
        return `₪${Number(amount).toFixed(2)}`;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    { field: 'accountNumber', headerName: 'Account', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <Chip
            label={params.value}
            color={
              params.value === 'Success'
                ? 'success'
                : params.value === 'Failed'
                ? 'error'
                : 'default'
            }
            size="small"
          />
        );
      },
    },
    {
      field: 'lastAction',
      headerName: 'Last Action',
      width: 130,
      renderCell: (params) => {
        if (!params.value) return null;
        
        const actionColors = {
          'Created': 'info',
          'Updated': 'warning',
          'Cancelled': 'error',
        };

        return (
          <Chip
            label={params.value}
            color={actionColors[params.value] || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 170,
      valueFormatter: (value) => {
        if (!value) return '';
        try {
          return new Date(value).toLocaleString('en-US');
        } catch {
          return '';
        }
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 170,
      valueFormatter: (value) => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleString('en-US');
        } catch {
          return '-';
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const status = params.row?.status;
        const isCancelled = status === 'Cancelled';
        
        return (
          <Box>
            <IconButton
              size="small"
              onClick={() => handleEditClick(params.row)}
              disabled={isCancelled}
              color="primary"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleCancelClick(params.row?.id)}
              disabled={isCancelled}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateClick}
            size="large"
          >
            Create Transaction
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            {transactions.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography variant="h6" color="text.secondary">
                  No transactions found
                </Typography>
              </Box>
            ) : (
              <DataGrid
                rows={transactions}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                disableRowSelectionOnClick
                checkboxSelection={false}
              />
            )}
          </Box>
        )}
      </Paper>

      <TransactionDialog
        open={dialogOpen}
        transaction={editingTransaction}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}