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
  submitting: false,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
      };

    case 'SET_SUBMITTING':
      return { ...state, submitting: action.value };

    case 'RESET_FORM':
      return { ...initialFormState };

    case 'LOAD_TRANSACTION':
      return {
        ...state,
        data: action.data,
      };

    default:
      return state;
  }
};

export function TransactionDialog({ open, transaction, onClose, onSubmit }) {
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

  const errors = useMemo(() => {
    return validateTransactionForm(formState.data);
  }, [formState.data]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = async () => {
    if (hasErrors) {
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

  const shouldShowError = (fieldName, fieldValue) => {
    const hasValue = fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
    if (!hasValue) return false;
    return !!errors[fieldName];
  };

  const getHelperText = (fieldName, fieldValue) => {
    if (!shouldShowError(fieldName, fieldValue)) return '';
    return errors[fieldName] || '';
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
            error={shouldShowError('fullNameHebrew', formState.data.fullNameHebrew)}
            helperText={getHelperText('fullNameHebrew', formState.data.fullNameHebrew)}
            disabled={isEditMode || formState.submitting}
            inputProps={{ maxLength: 20 }}
          />

          <TextField
            fullWidth
            required
            label="Full Name (English)"
            value={formState.data.fullNameEnglish}
            onChange={(e) => handleFieldChange('fullNameEnglish', e.target.value)}
            error={shouldShowError('fullNameEnglish', formState.data.fullNameEnglish)}
            helperText={getHelperText('fullNameEnglish', formState.data.fullNameEnglish)}
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
                error: shouldShowError('birthDate', formState.data.birthDate),
                helperText: getHelperText('birthDate', formState.data.birthDate),
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="ID Number"
            value={formState.data.idNumber}
            onChange={(e) => handleFieldChange('idNumber', e.target.value)}
            error={shouldShowError('idNumber', formState.data.idNumber)}
            helperText={getHelperText('idNumber', formState.data.idNumber)}
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
            error={shouldShowError('amount', formState.data.amount)}
            helperText={getHelperText('amount', formState.data.amount)}
            disabled={formState.submitting}
            inputProps={{ min: 0.01, max: 9999999999, step: 0.01 }}
          />

          <TextField
            fullWidth
            required
            label="Account Number"
            value={formState.data.accountNumber}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            error={shouldShowError('accountNumber', formState.data.accountNumber)}
            helperText={getHelperText('accountNumber', formState.data.accountNumber)}
            disabled={formState.submitting}
            slotProps={{
              htmlInput: { maxLength: 10 }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={formState.submitting} sx={{ color: '#424242' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: '#424242', color: '#fff' }}
          disabled={formState.submitting || hasErrors}
        >
          {formState.submitting ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}