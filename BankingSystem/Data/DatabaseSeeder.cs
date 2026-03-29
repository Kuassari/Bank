using BankingSystem.Constants;
using BankingSystem.Models;

namespace BankingSystem.Data
{
    public static class DatabaseSeeder
    {
        public static void SeedData(AppDbContext context)
        {
            if (context.Transactions.Any())
            {
                return;
            }

            var transactions = new List<Transaction>
            {
                new Transaction
                {
                    FullNameHebrew = "יוסי כהן",
                    FullNameEnglish = "Yossi Cohen",
                    BirthDate = new DateTime(1990, 5, 15),
                    IdNumber = "123456789",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 1000.50m,
                    AccountNumber = "1234567890",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "שרה לוי",
                    FullNameEnglish = "Sara Levi",
                    BirthDate = new DateTime(1985, 8, 20),
                    IdNumber = "987654321",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 500.00m,
                    AccountNumber = "0987654321",
                    Status = AppConstants.TransactionStatus.Failed,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "דוד מזרחי",
                    FullNameEnglish = "David Mizrahi",
                    BirthDate = new DateTime(1978, 12, 3),
                    IdNumber = "111222333",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 2500.75m,
                    AccountNumber = "1112223334",
                    Status = AppConstants.TransactionStatus.Cancelled,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    IsDeleted = true
                }
            };

            context.Transactions.AddRange(transactions);
            context.SaveChanges();
        }
    }
}