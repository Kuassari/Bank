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
                    BirthDate = new DateTime(1985, 3, 15),
                    IdNumber = "123456789",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 5000.00m,
                    AccountNumber = "1234567890",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "שרה לוי",
                    FullNameEnglish = "Sara Levi",
                    BirthDate = new DateTime(1990, 7, 22),
                    IdNumber = "987654321",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 1500.50m,
                    AccountNumber = "9876543210",
                    Status = AppConstants.TransactionStatus.Failed,
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "דוד מזרחי",
                    FullNameEnglish = "David Mizrahi",
                    BirthDate = new DateTime(1978, 11, 8),
                    IdNumber = "111222333",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 3000.00m,
                    AccountNumber = "1112223334",
                    Status = AppConstants.TransactionStatus.Cancelled,
                    CreatedAt = DateTime.UtcNow.AddDays(-6),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5),
                    IsDeleted = true
                },
                new Transaction
                {
                    FullNameHebrew = "רחל אברהם",
                    FullNameEnglish = "Rachel Avraham",
                    BirthDate = new DateTime(1995, 5, 10),
                    IdNumber = "444555666",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 750.25m,
                    AccountNumber = "4445556667",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "משה ישראלי",
                    FullNameEnglish = "Moshe Israeli",
                    BirthDate = new DateTime(1982, 1, 25),
                    IdNumber = "777888999",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 10000.00m,
                    AccountNumber = "7778889990",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "תמר שלום",
                    FullNameEnglish = "Tamar Shalom",
                    BirthDate = new DateTime(1988, 9, 14),
                    IdNumber = "222333444",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 2500.75m,
                    AccountNumber = "2223334445",
                    Status = AppConstants.TransactionStatus.Failed,
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "אבי גולן",
                    FullNameEnglish = "Avi Golan",
                    BirthDate = new DateTime(1975, 12, 30),
                    IdNumber = "555666777",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 25000.00m,
                    AccountNumber = "5556667778",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "רינה כץ",
                    FullNameEnglish = "Rina Katz",
                    BirthDate = new DateTime(1992, 4, 18),
                    IdNumber = "888999111",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 500.00m,
                    AccountNumber = "8889991112",
                    Status = AppConstants.TransactionStatus.Cancelled,
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2),
                    IsDeleted = true
                },
                new Transaction
                {
                    FullNameHebrew = "נועם ברק",
                    FullNameEnglish = "Noam Barak",
                    BirthDate = new DateTime(1998, 8, 5),
                    IdNumber = "333444555",
                    Type = AppConstants.TransactionType.Deposit,
                    Amount = 100.50m,
                    AccountNumber = "3334445556",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    IsDeleted = false
                },
                new Transaction
                {
                    FullNameHebrew = "לאה רוזן",
                    FullNameEnglish = "Lea Rosen",
                    BirthDate = new DateTime(1986, 6, 20),
                    IdNumber = "666777888",
                    Type = AppConstants.TransactionType.Withdrawal,
                    Amount = 3500.99m,
                    AccountNumber = "6667778889",
                    Status = AppConstants.TransactionStatus.Success,
                    CreatedAt = DateTime.UtcNow.AddHours(-12),
                    IsDeleted = false
                }
            };

            context.Transactions.AddRange(transactions);
            context.SaveChanges();
        }
    }
}