using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Controllers
{
    public class UserProfileController : Controller
    {
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly ILogger<UserProfileController> _logger;
        private readonly IPasswordPolicy _passwordPolicy;
        private readonly DO_PasswordPolicy _passwordStrength;

        public UserProfileController(
            IeSyaGatewayServices eSyaGatewayServices,
            ILogger<UserProfileController> logger,
            IPasswordPolicy passwordPolicy,
            IOptions<DO_PasswordPolicy> passwordStrength)
        {
            _eSyaGatewayServices = eSyaGatewayServices;
            _logger = logger;
            _passwordPolicy = passwordPolicy;
            _passwordStrength = passwordStrength.Value;
        }
        [HttpGet]
        public async Task<IActionResult> GetUserName(int userId)
        {
            try
            {
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.GetAsync<DO_ReturnParameter>("UserAccount/GetUserNameById?userId=" + userId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data.Key);
                }
                return Json("");
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public IActionResult ResetPassword()
        {
            ViewBag.formName = "Reset Password";
            return View(_passwordStrength);
        }

        public async Task<JsonResult> ResetUserPassword(string currentPassword, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrEmpty(currentPassword))
            {
                return Json(new { Status = false, Message = "Current Password cannot be blank." });
            }
            if (string.IsNullOrEmpty(newPassword) || string.IsNullOrEmpty(confirmPassword))
            {
                return Json(new { Status = false, Message = "New Password & Confirm Password cannot be blank." });
            }
            if (newPassword != confirmPassword)
            {
                return Json(new { Status = false, Message = "New Password & Confirm Password are not same." });
            }
            // var passswordpolicy = PasswordPolicy.IsValidPasswordPolicy(newPassword, 8, 1, false, false, false, false);
            var passswordpolicy = _passwordPolicy.IsValidPasswordPolicy(newPassword);
            if (!passswordpolicy.Status)
            {
                return Json(new { Status = false, passswordpolicy.Message });
            }
            try
            {
                var obj = new { UserID = AppSessionVariables.GetSessionUserID(HttpContext), Password = currentPassword, NewPassword = newPassword, _passwordStrength.PasswordRepeatationPolicy };
                var serviceResponse = await _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserAccount/ResetUserPassword", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    return Json(new { Status = false, Message = "Internal Error" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ResetUserPassword:For UserID {0} ", AppSessionVariables.GetSessionUserID(HttpContext).ToString());
                throw;
            }
        }

    }
}
