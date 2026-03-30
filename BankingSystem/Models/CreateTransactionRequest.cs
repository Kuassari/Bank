using BankingSystem.Constants;
using System.ComponentModel.DataAnnotations;

namespace BankingSystem.Models
{
    public class CreateTransactionRequest
    {
        [Required(ErrorMessage = "Hebrew name is required")]
        [StringLength(AppConstants.Validation.MaxNameLengthHebrew, ErrorMessage = "Hebrew name cannot exceed 20 characters")]
        [RegularExpression(AppConstants.Validation.HebrewNamePattern, ErrorMessage = "Hebrew name must contain only Hebrew characters, spaces, hyphens and apostrophes")]
        public string FullNameHebrew { get; set; } = string.Empty;

        [Required(ErrorMessage = "English name is required")]
        [StringLength(AppConstants.Validation.MaxNameLengthEnglish, ErrorMessage = "English name cannot exceed 15 characters")]
        [RegularExpression(AppConstants.Validation.EnglishNamePattern, ErrorMessage = "English name must contain only English characters, spaces, hyphens and apostrophes")]
        public string FullNameEnglish { get; set; } = string.Empty;

        [Required(ErrorMessage = "Birth date is required")]
        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "ID number is required")]
        [RegularExpression(AppConstants.Validation.IdNumberPattern, ErrorMessage = "ID number must be exactly 9 digits")]
        public string IdNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Transaction type is required")]
        public AppConstants.TransactionType Type { get; set; }

        [Required(ErrorMessage = "Amount is required")]
        [Range(AppConstants.Validation.MinTransactionAmount, AppConstants.Validation.MaxTransactionAmount, ErrorMessage = "Amount must be between 0.01 and 9,999,999,999")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Account number is required")]
        [RegularExpression(AppConstants.Validation.AccountNumberPattern, ErrorMessage = "Account number must be exactly 10 digits")]
        public string AccountNumber { get; set; } = string.Empty;
    }
}