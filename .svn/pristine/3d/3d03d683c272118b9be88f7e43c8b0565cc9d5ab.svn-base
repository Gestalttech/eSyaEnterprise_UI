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
using eSyaEnterprise_UI.ApplicationCodeTypes;

namespace eSyaEnterprise_UI.Areas.GenerateToken.Controllers
{
    [SessionTimeout]
    public class TokenManagementController : Controller
    {
        private readonly IeSyaGenerateTokenAPIServices _eSyaGenerateTokenAPIServices;
        private readonly ILogger<TokenManagementController> _logger;
        public TokenManagementController(IeSyaGenerateTokenAPIServices eSyaGenerateTokenAPIServices, ILogger<TokenManagementController> logger)
        {
            _eSyaGenerateTokenAPIServices = eSyaGenerateTokenAPIServices;
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        [Area("GenerateToken")]
        public async Task<IActionResult> ETM_08_00()
        {
            try
            {
                var serviceresponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_Floor>>("CounterMapping/GetFloorsbyFloorId?codetype=" + ApplicationCodeTypeValues.FloorId);
                if (serviceresponse.Status)
                {
                    ViewBag.Floors = serviceresponse.Data.
                         Select(b => new SelectListItem
                         {
                             Value = b.FloorId.ToString(),
                             Text = b.FloorName,
                         }).ToList();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetFloorsbyFloorId");

                }

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFloorsbyFloorId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Getting Tokens for Grid
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetTokenDetailByTokenType(string tokenType)
        {
            try
            {
                var parameter = "?businessKey=" + AppSessionVariables.GetSessionBusinessKey(HttpContext);
                parameter += "&tokenType=" + tokenType.ToString();
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_TokenGeneration>>("TokenManagement/GetTokenDetailByTokenType" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetTokenDetailByTokenType:params: businessKey:{0},tokenType:{1}",
                        AppSessionVariables.GetSessionBusinessKey(HttpContext).ToString(), tokenType));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Tokens for Grid
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetTokenTypeByCounter(string counterNumber)
        {
            try
            {
                var parameter = "?businessKey=" + AppSessionVariables.GetSessionBusinessKey(HttpContext);
                parameter += "&counterNumber=" + counterNumber.ToString();
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_TokenConfiguration>>("TokenManagement/GetTokenTypeByCounter" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetTokenTypeByCounter:params: businessKey:{0},counterNumber:{1}",
                        AppSessionVariables.GetSessionBusinessKey(HttpContext).ToString(), counterNumber));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Calling Token
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateCallingToken(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateCallingToken", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateCallingToken:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Holding Token
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateTokenToHold(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateTokenToHold", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateTokenToHold:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Release Token
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateTokenToRelease(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateTokenToRelease", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateTokenToRelease:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Token To Completed
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateTokenStatusToCompleted(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateTokenStatusToCompleted", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateTokenStatusToCompleted:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Calling Next Token
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateToCallingNextToken(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateToCallingNextToken", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateToCallingNextToken:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Calling Confirmation
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateCallingConfirmation(DO_TokenGeneration obj)
        {

            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenManagement/UpdateCallingConfirmation", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateCallingConfirmation:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
    }
}
