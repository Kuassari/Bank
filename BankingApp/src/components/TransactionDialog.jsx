import { useEffect, useReducer, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import { validateTransactionForm } from '../utils/validation';

const initialFormState = {
  data: {
    fullNameHebrew: '',
    fullNameEnglish: '',
    birthDate: null,
    idNumber: '',
    type: 0,
    amount: '',
    accountNumber: '',
  },
  errors: {},
  submitting: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: null },
      };

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };

    case 'SET_SUBMITTING':
      return { ...state, submitting: action.value };

    case 'RESET_FORM':
      return { ...initialFormState };

    case 'LOAD_TRANSACTION':
      return {
        ...state,
        data: action.data,
        errors: {},
      };

    default:
      return state;
  }
};

function TransactionDialog({ open, transaction, onClose, onSubmit }) {
  const isEditMode = !!transaction;
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  useEffect(() => {
    if (open) {
      if (transaction) {
        dispatch({
          type: 'LOAD_TRANSACTION',
          data: {
            fullNameHebrew: transaction.fullNameHebrew || '',
            fullNameEnglish: transaction.fullNameEnglish || '',
            birthDate: transaction.birthDate ? dayjs(transaction.birthDate) : null,
            idNumber: transaction.idNumber || '',
            type: transaction.type === 'Deposit' ? 0 : transaction.type === 'Withdrawal' ? 1 : transaction.type ?? 0,
            amount: transaction.amount || '',
            accountNumber: transaction.accountNumber || '',
          },
        });
      } else {
        dispatch({ type: 'RESET_FORM' });
      }
    }
  }, [open, transaction]);

  // Validate on every change
  const validationErrors = useMemo(() => {
    return validateTransactionForm(formState.data);
  }, [formState.data]);

  // Disable submit if there are errors
  const hasErrors = Object.keys(validationErrors).length > 0;

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleBlur = (field) => {
    // Show error for this field on blur
    const fieldError = validationErrors[field];
    if (fieldError) {
      dispatch({ 
        type: 'SET_ERRORS', 
        errors: { ...formState.errors, [field]: fieldError } 
      });
    }
  };

  const handleSubmit = async () => {
    // Final validation
    if (hasErrors) {
      dispatch({ type: 'SET_ERRORS', errors: validationErrors });
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', value: true });

    const payload = {
      ...formState.data,
      birthDate: formState.data.birthDate?.toISOString(),
      amount: Number(formState.data.amount),
    };

    try {
      await onSubmit(payload, isEditMode, transaction?.id);
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Error submitting form:', error);
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  };

  const handleClose = () => {
    if (!formState.submitting) {
      dispatch({ type: 'RESET_FORM' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit Transaction' : 'Create Transaction'}
        <IconButton
          onClick={handleClose}
          disabled={formState.submitting}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            label="Full Name (Hebrew)"
            value={formState.data.fullNameHebrew}
            onChange={(e) => handleFieldChange('fullNameHebrew', e.target.value)}
            onBlur={() => handleBlur('fullNameHebrew')}
            error={!!formState.errors.fullNameHebrew}
            helperText={formState.errors.fullNameHebrew}
            disabled={isEditMode || formState.submitting}
            inputProps={{ maxLength: 20 }}
          />

          <TextField
            fullWidth
            required
            label="Full Name (English)"
            value={formState.data.fullNameEnglish}
            onChange={(e) => handleFieldChange('fullNameEnglish', e.target.value)}
            onBlur={() => handleBlur('fullNameEnglish')}
            error={!!formState.errors.fullNameEnglish}
            helperText={formState.errors.fullNameEnglish}
            disabled={isEditMode || formState.submitting}
            inputProps={{ maxLength: 15 }}
          />

          <DatePicker
            label="Birth Date *"
            value={formState.data.birthDate}
            onChange={(value) => handleFieldChange('birthDate', value)}
            disabled={isEditMode || formState.submitting}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                onBlur: () => handleBlur('birthDate'),
                error: !!formState.errors.birthDate,
                helperText: formState.errors.birthDate,
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="ID Number"
            value={formState.data.idNumber}
            onChange={(e) => handleFieldChange('idNumber', e.target.value)}
            onBlur={() => handleBlur('idNumber')}
            error={!!formState.errors.idNumber}
            helperText={formState.errors.idNumber}
            disabled={isEditMode || formState.submitting}
            inputProps={{ maxLength: 9 }}
          />

          <TextField
            fullWidth
            required
            select
            label="Transaction Type"
            value={formState.data.type}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            disabled={isEditMode || formState.submitting}
          >
            <MenuItem value={0}>Deposit</MenuItem>
            <MenuItem value={1}>Withdrawal</MenuItem>
          </TextField>

          <TextField
            fullWidth
            required
            label="Amount"
            type="number"
            value={formState.data.amount}
            onChange={(e) => handleFieldChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
            error={!!formState.errors.amount}
            helperText={formState.errors.amount}
            disabled={formState.submitting}
            inputProps={{ min: 0.01, max: 9999999999, step: 0.01 }}
          />

          <TextField
            fullWidth
            required
            label="Account Number"
            value={formState.data.accountNumber}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            onBlur={() => handleBlur('accountNumber')}
            error={!!formState.errors.accountNumber}
            helperText={formState.errors.accountNumber}
            disabled={formState.submitting}
            inputProps={{ maxLength: 10 }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={formState.submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={formState.submitting || hasErrors}
        >
          {formState.submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDialog;