using BankingSystem.Constants;
using BankingSystem.Models;

namespace BankingSystem.Services
{
    public class ExternalBankService : IExternalBankService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ExternalBankService> _logger;
        private readonly IConfiguration _configuration;

        public ExternalBankService(
            HttpClient httpClient,
            ILogger<ExternalBankService> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
        }

        private static bool SimulateApiCall(int successRate = 95)
        {
            return Random.Shared.Next(100) < successRate;
        }

        public async Task<BaseResponse<string>> GetBankAuthorizationAsync(string userId)
        {
            var secretId = _configuration["ExternalBank:SecretId"];
            var endpoint = _configuration["ExternalBank:BaseUrl"] + _configuration["ExternalBank:Endpoints:CreateToken"];

            _logger.LogInformation("Requesting token from {Endpoint} for userId={UserId}", endpoint, userId);

            try
            {
                // Real API call if endpoint was working
                // var response = await _httpClient.PostAsJsonAsync(endpoint, new { 
                //     userId = userId, 
                //     SecretId = secretId 
                // });
                // var result = await response.Content.ReadFromJsonAsync<BaseResponse<string>>();

                if (SimulateApiCall(95))
                {
                    var token = Guid.NewGuid().ToString();
                    _logger.LogInformation("Token created: {Token}", token);

                    return new BaseResponse<string>
                    {
                        Success = true,
                        Code = ResponseCode.Success,
                        Message = "Token created successfully",
                        Data = token
                    };
                }

                _logger.LogWarning("Token creation failed for userId: {UserId}", userId);

                return new BaseResponse<string>
                {
                    Success = false,
                    Code = ResponseCode.Unauthorized,
                    Message = "Token creation failed",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating token for userId: {UserId}", userId);

                return new BaseResponse<string>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error creating token",
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<string>> ProcessTransactionAsync(
            AppConstants.TransactionType transactionType,
            decimal amount,
            string accountNumber)
        {
            var endpoint = transactionType switch
            {
                AppConstants.TransactionType.Deposit =>
                    _configuration["ExternalBank:BaseUrl"] +
                    _configuration["ExternalBank:Endpoints:CreateDeposit"],

                AppConstants.TransactionType.Withdrawal =>
                    _configuration["ExternalBank:BaseUrl"] +
                    _configuration["ExternalBank:Endpoints:CreateWithdrawal"],

                _ => throw new ArgumentException($"Unknown transaction type: {transactionType}")
            };

            _logger.LogInformation(
                "Processing {Type} at {Endpoint} - Amount: {Amount:C}, Account: {Account}",
                transactionType, endpoint, amount, accountNumber);

            try
            {
                // Real API call if endpoint was working
                // var response = await _httpClient.PostAsJsonAsync(endpoint, new { 
                //     userId = userId, 
                //     SecretId = secretId 
                // });
                // var result = await response.Content.ReadFromJsonAsync<BaseResponse<string>>();

                if (SimulateApiCall(90))
                {
                    _logger.LogInformation("{Type} completed successfully", transactionType);

                    return new BaseResponse<string>
                    {
                        Success = true,
                        Code = ResponseCode.Success,
                        Message = $"{transactionType} successful",
                        Data = AppConstants.TransactionStatus.Success.ToString()
                    };
                }

                _logger.LogWarning("{Type} failed", transactionType);

                return new BaseResponse<string>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = $"{transactionType} failed",
                    Data = AppConstants.TransactionStatus.Failed.ToString()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing {Type}", transactionType);

                return new BaseResponse<string>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = $"Error processing {transactionType}",
                    Data = AppConstants.TransactionStatus.Failed.ToString()
                };
            }
        }
    }
}