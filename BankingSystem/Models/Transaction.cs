using BankingSystem.Constants;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BankingSystem.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(AppConstants.Validation.MaxNameLengthHebrew)]
        public string FullNameHebrew { get; set; } = string.Empty;

        [Required]
        [MaxLength(AppConstants.Validation.MaxNameLengthEnglish)]
        public string FullNameEnglish { get; set; } = string.Empty;

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        [StringLength(
            AppConstants.Validation.IdNumberLength,
            MinimumLength = AppConstants.Validation.IdNumberLength)]
        public string IdNumber { get; set; } = string.Empty;

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppConstants.TransactionType Type { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(AppConstants.Validation.MinTransactionAmount, AppConstants.Validation.MaxTransactionAmount)]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(AppConstants.Validation.MaxAccountNumberLength)]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AppConstants.TransactionStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; } = false;

        [NotMapped]
        public string LastAction
        {
            get
            {
                if (Status == AppConstants.TransactionStatus.Cancelled)
                    return "Cancelled";

                if (UpdatedAt.HasValue)
                    return "Updated";

                return "Created";
            }
        }
    }
}