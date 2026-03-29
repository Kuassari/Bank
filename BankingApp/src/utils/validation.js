export function validateTransactionForm(fields) {
  const errors = {};

  if (!fields.fullNameHebrew?.trim()) {
    errors.fullNameHebrew = 'Hebrew name is required';
  } else if (fields.fullNameHebrew.length > 20) {
    errors.fullNameHebrew = 'Hebrew name - max 20 characters';
  } else if (!/^[\u0590-\u05FF\s'-]+$/.test(fields.fullNameHebrew)) {
    errors.fullNameHebrew = 'Hebrew letters, space, apostrophe and hyphen only';
  }

  if (!fields.fullNameEnglish?.trim()) {
    errors.fullNameEnglish = 'English name is required';
  } else if (fields.fullNameEnglish.length > 15) {
    errors.fullNameEnglish = 'English name - max 15 characters';
  } else if (!/^[a-zA-Z\s'-]+$/.test(fields.fullNameEnglish)) {
    errors.fullNameEnglish = 'English letters, space, apostrophe and hyphen only';
  }

  if (!fields.birthDate) {
    errors.birthDate = 'Birth date is required';
  }

  if (!fields.idNumber?.trim()) {
    errors.idNumber = 'ID number is required';
  } else if (!/^\d{9}$/.test(fields.idNumber)) {
    errors.idNumber = 'ID number must be exactly 9 digits';
  }

  if (!fields.amount) {
    errors.amount = 'Amount is required';
  } else if (fields.amount < 0.01 || fields.amount > 9999999999) {
    errors.amount = 'Amount must be between 0.01 and 9,999,999,999';
  }

  if (!fields.accountNumber?.trim()) {
    errors.accountNumber = 'Account number is required';
  } else if (!/^\d{1,10}$/.test(fields.accountNumber)) {
    errors.accountNumber = 'Account number - up to 10 digits only';
  }

  return errors;
}