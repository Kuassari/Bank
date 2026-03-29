using BankingSystem.Constants;

namespace BankingSystem.Models
{
    public record BaseResponse<T>
    {
        public required bool Success { get; init; }
        public required string Message { get; init; }
        public required ResponseCode Code { get; init; }
        public T? Data { get; init; }

        public static BaseResponse<T> SuccessResponse(T data, string message = "Success")
        {
            return new BaseResponse<T>
            {
                Success = true,
                Message = message,
                Code = ResponseCode.Success,
                Data = data
            };
        }

        public static BaseResponse<T> ErrorResponse(string message, ResponseCode code = ResponseCode.BadRequest)
        {
            return new BaseResponse<T>
            {
                Success = false,
                Message = message,
                Code = code,
                Data = default
            };
        }
    }
}