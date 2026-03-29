namespace BankingSystem.Constants
{
    public static class AppConstants
    {
        public enum TransactionType
        {
            Deposit,
            Withdrawal
        }

        public enum TransactionStatus
        {
            Success,
            Failed,
            Cancelled
        }

        public static class Validation
        {
            public const int MaxNameLengthHebrew = 20;
            public const int MaxNameLengthEnglish = 15;
            public const int IdNumberLength = 9;
            public const int MaxAccountNumberLength = 10;

            public const double MinTransactionAmount = 0.01;
            public const double MaxTransactionAmount = 9_999_999_999.0;

            public const string HebrewNamePattern = @"^[\u0590-\u05FF\s'-]+$";
            public const string EnglishNamePattern = @"^[a-zA-Z\s'-]+$";
            public const string IdNumberPattern = @"^\d{9}$";
            public const string AccountNumberPattern = @"^\d{10}$";
        }
    }
}