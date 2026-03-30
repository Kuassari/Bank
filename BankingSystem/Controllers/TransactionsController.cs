using BankingSystem.Constants;
using BankingSystem.Data;
using BankingSystem.Models;
using BankingSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IExternalBankService _externalBankService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            AppDbContext context,
            IExternalBankService externalBankService,
            ILogger<TransactionsController> logger)
        {
            _context = context;
            _externalBankService = externalBankService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<BaseResponse<List<Transaction>>>> GetAll()
        {
            try
            {
                var transactions = await _context.Transactions
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                return Ok(new BaseResponse<List<Transaction>>
                {
                    Success = true,
                    Code = ResponseCode.Success,
                    Message = "Transactions retrieved successfully",
                    Data = transactions
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions");
                return StatusCode(500, new BaseResponse<List<Transaction>>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error retrieving transactions",
                    Data = null
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BaseResponse<Transaction>>> GetById(int id)
        {
            try
            {
                var transaction = await _context.Transactions
                    .Where(t => t.Id == id)
                    .FirstOrDefaultAsync();

                if (transaction == null)
                {
                    return NotFound(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = ResponseCode.NotFound,
                        Message = "Transaction not found",
                        Data = null
                    });
                }

                return Ok(new BaseResponse<Transaction>
                {
                    Success = true,
                    Code = ResponseCode.Success,
                    Message = "Transaction retrieved successfully",
                    Data = transaction
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction {Id}", id);
                return StatusCode(500, new BaseResponse<Transaction>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error retrieving transaction",
                    Data = null
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<BaseResponse<Transaction>>> Create([FromBody] CreateTransactionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = ResponseCode.BadRequest,
                        Message = string.Join("; ", errors),
                        Data = null
                    });
                }

                var authResponse = await _externalBankService.GetBankAuthorizationAsync(request.IdNumber);
                if (!authResponse.Success)
                {
                    return BadRequest(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = authResponse.Code,
                        Message = "Authorization failed",
                        Data = null
                    });
                }

                var processResponse = await _externalBankService.ProcessTransactionAsync(
                    request.Type, request.Amount, request.AccountNumber);

                var status = processResponse.Success
                    ? AppConstants.TransactionStatus.Success
                    : AppConstants.TransactionStatus.Failed;

                var transaction = new Transaction
                {
                    FullNameHebrew = request.FullNameHebrew,
                    FullNameEnglish = request.FullNameEnglish,
                    BirthDate = request.BirthDate,
                    IdNumber = request.IdNumber,
                    Type = request.Type,
                    Amount = request.Amount,
                    AccountNumber = request.AccountNumber,
                    Status = status,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = transaction.Id },
                    new BaseResponse<Transaction>
                    {
                        Success = true,
                        Code = ResponseCode.Success,
                        Message = "Transaction created successfully",
                        Data = transaction
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction");
                return StatusCode(500, new BaseResponse<Transaction>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error creating transaction",
                    Data = null
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BaseResponse<Transaction>>> Update(int id, [FromBody] CreateTransactionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = ResponseCode.BadRequest,
                        Message = string.Join("; ", errors),
                        Data = null
                    });
                }

                var transaction = await _context.Transactions
                    .Where(t => t.Id == id)
                    .FirstOrDefaultAsync();

                if (transaction == null)
                {
                    return NotFound(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = ResponseCode.NotFound,
                        Message = "Transaction not found",
                        Data = null
                    });
                }

                if (transaction.Status == AppConstants.TransactionStatus.Cancelled)
                {
                    return BadRequest(new BaseResponse<Transaction>
                    {
                        Success = false,
                        Code = ResponseCode.BadRequest,
                        Message = "Cannot update cancelled transaction",
                        Data = null
                    });
                }

                var processResponse = await _externalBankService.ProcessTransactionAsync(
                    transaction.Type, request.Amount, request.AccountNumber);

                transaction.Amount = request.Amount;
                transaction.AccountNumber = request.AccountNumber;
                transaction.Status = processResponse.Success
                    ? AppConstants.TransactionStatus.Success
                    : AppConstants.TransactionStatus.Failed;
                transaction.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new BaseResponse<Transaction>
                {
                    Success = true,
                    Code = ResponseCode.Success,
                    Message = "Transaction updated successfully",
                    Data = transaction
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating transaction {Id}", id);
                return StatusCode(500, new BaseResponse<Transaction>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error updating transaction",
                    Data = null
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<BaseResponse<object>>> Cancel(int id)
        {
            try
            {
                var transaction = await _context.Transactions
                    .Where(t => t.Id == id)
                    .FirstOrDefaultAsync();

                if (transaction == null)
                {
                    return NotFound(new BaseResponse<object>
                    {
                        Success = false,
                        Code = ResponseCode.NotFound,
                        Message = "Transaction not found",
                        Data = null
                    });
                }

                if (transaction.Status == AppConstants.TransactionStatus.Cancelled)
                {
                    return BadRequest(new BaseResponse<object>
                    {
                        Success = false,
                        Code = ResponseCode.BadRequest,
                        Message = "Transaction already cancelled",
                        Data = null
                    });
                }

                transaction.Status = AppConstants.TransactionStatus.Cancelled;
                transaction.IsDeleted = true;
                transaction.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new BaseResponse<object>
                {
                    Success = true,
                    Code = ResponseCode.Success,
                    Message = "Transaction cancelled successfully",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling transaction {Id}", id);
                return StatusCode(500, new BaseResponse<object>
                {
                    Success = false,
                    Code = ResponseCode.InternalServerError,
                    Message = "Error cancelling transaction",
                    Data = null
                });
            }
        }
    }
}