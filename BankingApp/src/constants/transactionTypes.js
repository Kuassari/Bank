export const TRANSACTION_TYPES = {
  DEPOSIT: { value: 0, label: 'Deposit' },
  WITHDRAWAL: { value: 1, label: 'Withdrawal' },
};

export const TRANSACTION_STATUSES = {
  SUCCESS: { value: 'Success', label: 'Success', color: 'success' },
  FAILED: { value: 'Failed', label: 'Failed', color: 'error' },
  CANCELLED: { value: 'Cancelled', label: 'Cancelled', color: 'default' },
};

export const TRANSACTION_ACTIONS = {
  CREATED: { value: 'Created', label: 'Created', color: 'info' },
  UPDATED: { value: 'Updated', label: 'Updated', color: 'warning' },
  CANCELLED: { value: 'Cancelled', label: 'Cancelled', color: 'default' },
};