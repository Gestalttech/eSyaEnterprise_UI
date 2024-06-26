using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.GenerateToken.Data;
using eSyaEnterprise_UI.Areas.GenerateToken.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using eSyaEnterprise_UI.Extension;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;

namespace eSyaEnterprise_UI.Areas.GenerateToken.Controllers
{
   
    public class GenerateController : Controller
    {
        private readonly IeSyaGenerateTokenAPIServices _eSyaGenerateTokenAPIServices;
        private readonly ILogger<GenerateController> _logger;
        private readonly ISmsServices _smsServices;

        public GenerateController(IeSyaGenerateTokenAPIServices eSyaGenerateTokenAPIServices, ISmsServices smsServices, ILogger<GenerateController> logger)
        {
            _eSyaGenerateTokenAPIServices = eSyaGenerateTokenAPIServices;
            _smsServices = smsServices;
            _logger = logger;
        }
        [Area("GenerateToken")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ETM_05_00(int businessKey)
        {
            //ViewBag.businessKey = businessKey;

            ViewBag.businessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);

            //ViewBag.businessKey = 11;

            return View();
        }

        [Area("GenerateToken")]
        [AllowAnonymous]
        public IActionResult ETM_06_00(int businessKey)
        {

            //ViewBag.businessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
            ViewBag.businessKey = 11;
            return View();
        }

        [Area("GenerateToken")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ETM_07_00()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> GetTokenTypes()
        {
            try
            {
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_TokenConfiguration>>("TokenGeneration/GetAllConfigureTokens");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllConfigureTokens");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GenerateToken(DO_TokenGeneration obj)
        {
            try
            {

                obj.TokenType = string.IsNullOrEmpty(obj.TokenType) ? string.Empty : obj.TokenType;
                obj.TokenKey = string.IsNullOrEmpty(obj.TokenKey) ? string.Empty : obj.TokenKey;
                obj.MobileNumber = string.IsNullOrEmpty(obj.MobileNumber) ? string.Empty : obj.MobileNumber;
                obj.CallingCounter = string.IsNullOrEmpty(obj.CallingCounter) ? string.Empty : obj.CallingCounter;
                obj.TokenStatus = string.IsNullOrEmpty(obj.TokenStatus) ? string.Empty : obj.TokenStatus;
                //obj.ConfirmedTokenType = string.IsNullOrEmpty(obj.ConfirmedTokenType) ? string.Empty : obj.ConfirmedTokenType;
                //obj.ConfirmationUrl = string.IsNullOrEmpty(obj.ConfirmationUrl) ? string.Empty : obj.ConfirmationUrl;
               
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenGeneration/GenerateToken", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Status)
                        return Json(new { Status = true, key = serviceResponse.Data.Key, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage });
                    else
                        return Json(new { Status = false, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage, serviceResponse.Data.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GenerateToken:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GenerateToken:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Warning = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GenerateOTP(string Otptype, string MobileNumber)
        {
            DO_OTP obj = new DO_OTP();
            try
            {
                obj.Otptype = Otptype;
                obj.MobileNumber = MobileNumber;
                obj.GeneratedOn = DateTime.Now;
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenGeneration/GenerateOTP", obj);
                if (serviceResponse.Status)
                {

                    if (serviceResponse.Data.Status)
                    {
                        SendSMSForMobileOTP(91, obj.MobileNumber, serviceResponse.Data.Key);
                        return Json(new { Status = true, key = serviceResponse.Data.Key, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage });
                    }
                    else
                        return Json(new { Status = false, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage, serviceResponse.Data.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GenerateOTP:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GenerateOTP:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Warning = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> ConfirmOTP(DO_OTP obj)
        {
            try
            {
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenGeneration/ConfirmOTP", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Status)
                        return Json(new { Status = true, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage });
                    else
                        return Json(new { Status = false, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage, serviceResponse.Data.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ConfirmOTP:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ConfirmOTP:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Warning = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Getting Tokens Status By Mobile Number
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetTokenDetailByMobile(int businessKey, int isdCode, string mobileNumber)
        {
            try
            {
                //businessKey= AppSessionVariables.GetSessionBusinessKey(HttpContext);
                var parameter = "?businessKey=" + businessKey;
                parameter += "&isdCode=" + isdCode.ToString();
                parameter += "&mobileNumber=" + mobileNumber.ToString();
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_TokenGeneration>>("TokenGeneration/GetTokenDetailByMobile" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetTokenDetailByMobile:params: businessKey:{0},isdCode:{1},mobileNumber:{2}",
                        AppSessionVariables.GetSessionBusinessKey(HttpContext).ToString(), isdCode, mobileNumber));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        public void SendSMSForMobileOTP(int isdCode, string mobileNumber, string otp)
        {
            try
            {
                DO_SmsParameter smsParams = new DO_SmsParameter
                {
                    MessageType = "NGC",
                    TEventID = SMSTriggerEventValues.MobileLoginOTP,
                    FormID = 93,//AppSessionVariables.GetSessionFormID(HttpContext),
                    MobileNumber = mobileNumber,
                    OTP = otp
                };
                _smsServices.SendSmsForForm(smsParams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:SendSMSForMobileOTP");
                //throw ex;
            }
        }
    }
}
