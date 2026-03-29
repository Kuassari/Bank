using BankingSystem.Constants;
using BankingSystem.Models;

namespace BankingSystem.Services
{
    public interface IExternalBankService
    {
        Task<BaseResponse<string>> GetBankAuthorizationAsync(string userId);
        Task<BaseResponse<string>> ProcessTransactionAsync(
            AppConstants.TransactionType transactionType,
            decimal amount,
            string accountNumber);
    }
}