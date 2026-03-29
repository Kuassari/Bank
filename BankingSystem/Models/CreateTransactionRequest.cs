using BankingSystem.Constants;
using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Models
{
    public record CreateTransactionRequest
    {
        [Required(ErrorMessage = "Full name in Hebrew is required")]
        [MaxLength(AppConstants.Validation.MaxNameLengthHebrew)]
        [RegularExpression(
            AppConstants.Validation.HebrewNamePattern,
            ErrorMessage = "Full name in Hebrew must contain only Hebrew characters, spaces, apostrophes, and hyphens")]
        public required string FullNameHebrew { get; init; }

        [Required(ErrorMessage = "Full name in English is required")]
        [MaxLength(AppConstants.Validation.MaxNameLengthEnglish)]
        [RegularExpression(
            AppConstants.Validation.EnglishNamePattern,
            ErrorMessage = "Full name in English must contain only letters, spaces, apostrophes, and hyphens")]
        public required string FullNameEnglish { get; init; }

        [Required(ErrorMessage = "Birth date is required")]
        public required DateTime BirthDate { get; init; }

        [Required(ErrorMessage = "ID number is required")]
        [RegularExpression(
            AppConstants.Validation.IdNumberPattern,
            ErrorMessage = "ID number must be exactly 9 digits")]
        public required string IdNumber { get; init; }

        [Required(ErrorMessage = "Transaction type is required")]
        public required AppConstants.TransactionType Type { get; init; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(
            AppConstants.Validation.MinTransactionAmount,
            AppConstants.Validation.MaxTransactionAmount,
            ErrorMessage = "Amount must be between 0.01 and 9,999,999,999")]
        public required decimal Amount { get; init; }

        [Required(ErrorMessage = "Account number is required")]
        [RegularExpression(
            AppConstants.Validation.AccountNumberPattern,
            ErrorMessage = "Account number must be between 1 and 10 digits")]
        public required string AccountNumber { get; init; }
    }
}