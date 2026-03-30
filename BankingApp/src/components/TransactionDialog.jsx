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

const prepareDataForSubmit = (formData) => {
  return {
    fullNameHebrew: formData.fullNameHebrew,
    fullNameEnglish: formData.fullNameEnglish,
    birthDate: formData.birthDate?.toISOString(),
    idNumber: formData.idNumber,
    type: formData.type,
    amount: Number(formData.amount),
    accountNumber: formData.accountNumber,
  };
};

export function TransactionDialog({ open, transaction, onClose, onSubmit }) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const isEditMode = !!transaction;

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

  const errors = useMemo(() => validateTransactionForm(formState.data), [formState.data]);
  const hasErrors = Object.keys(errors).length > 0;

  const handleFieldChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = async () => {
    if (hasErrors) return;

    dispatch({ type: 'SET_SUBMITTING', value: true });

    const data = prepareDataForSubmit(formState.data);

    try {
      await onSubmit(data, isEditMode, transaction?.id);
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

  const isFieldDisabled = (fieldName) => {
    if (formState.submitting) return true;
    if (isEditMode) {
      const editableFields = ['amount', 'accountNumber'];
      return !editableFields.includes(fieldName);
    }
    return false;
  };

  const getFieldError = (fieldName, fieldValue) => {
    const hasValue = fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;
    return hasValue && !!errors[fieldName];
  };

  const getFieldHelperText = (fieldName, fieldValue) => {
    return getFieldError(fieldName, fieldValue) ? errors[fieldName] : '';
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
            error={getFieldError('fullNameHebrew', formState.data.fullNameHebrew)}
            helperText={getFieldHelperText('fullNameHebrew', formState.data.fullNameHebrew)}
            disabled={isFieldDisabled('fullNameHebrew')}
            inputProps={{ maxLength: 20 }}
          />

          <TextField
            fullWidth
            required
            label="Full Name (English)"
            value={formState.data.fullNameEnglish}
            onChange={(e) => handleFieldChange('fullNameEnglish', e.target.value)}
            error={getFieldError('fullNameEnglish', formState.data.fullNameEnglish)}
            helperText={getFieldHelperText('fullNameEnglish', formState.data.fullNameEnglish)}
            disabled={isFieldDisabled('fullNameEnglish')}
            inputProps={{ maxLength: 15 }}
          />

          <DatePicker
            label="Birth Date *"
            value={formState.data.birthDate}
            onChange={(value) => handleFieldChange('birthDate', value)}
            disabled={isFieldDisabled('birthDate')}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: getFieldError('birthDate', formState.data.birthDate),
                helperText: getFieldHelperText('birthDate', formState.data.birthDate),
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="ID Number"
            value={formState.data.idNumber}
            onChange={(e) => handleFieldChange('idNumber', e.target.value)}
            error={getFieldError('idNumber', formState.data.idNumber)}
            helperText={getFieldHelperText('idNumber', formState.data.idNumber)}
            disabled={isFieldDisabled('idNumber')}
            inputProps={{ maxLength: 9 }}
          />

          <TextField
            fullWidth
            required
            select
            label="Transaction Type"
            value={formState.data.type}
            onChange={(e) => handleFieldChange('type', e.target.value)}
            disabled={isFieldDisabled('type')}
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
            error={getFieldError('amount', formState.data.amount)}
            helperText={getFieldHelperText('amount', formState.data.amount)}
            disabled={isFieldDisabled('amount')}
            inputProps={{ min: 0.01, max: 9999999999, step: 0.01 }}
          />

          <TextField
            fullWidth
            required
            label="Account Number"
            value={formState.data.accountNumber}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            error={getFieldError('accountNumber', formState.data.accountNumber)}
            helperText={getFieldHelperText('accountNumber', formState.data.accountNumber)}
            disabled={isFieldDisabled('accountNumber')}
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