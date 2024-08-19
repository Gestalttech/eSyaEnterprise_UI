using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Egypt.Data;
using eSyaEnterprise_UI.Areas.Egypt.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Egypt.Controllers
{
    [SessionTimeout]
    public class GenerateController : Controller
    {
        private readonly IEgyptTokenSystemAPIServices _EgyptAdminAPIServices;
        private readonly ILogger<GenerateController> _logger;
        private string? tokenArea;
        public GenerateController(IEgyptTokenSystemAPIServices EgyptAdminAPIServices, ILogger<GenerateController> logger)
        {
            _EgyptAdminAPIServices = EgyptAdminAPIServices;
            _logger = logger;
        }

        [Area("Egypt")]
        public async Task<IActionResult> ETM_05_00()
        {
            //tokenArea = TokenArea;
           string ip= AppSessionVariables.GetIPAddress(HttpContext);
           int businesskey = 11;
           var param = "?businessKey=" + businesskey + "&IpAddress=" + ip;

            var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<DO_TokenGeneration>("TokenGeneration/GetFloorIDbyIPAddress" + param);
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.TokenArea = serviceResponse.Data.TokenArea;
                    ViewBag.businessKey = 11;

                }
                else
                {
                    ViewBag.TokenArea = tokenArea;
                    ViewBag.IPADDRESS = ip;
                }
              
            }
            else
            {
                ViewBag.TokenArea = tokenArea;
                ViewBag.IPADDRESS = ip;
            } 

           
            return View();
        }
        [Area("Egypt")]
        [HttpPost]
        public async Task<JsonResult> GetTokenTypes()
        {
            try
            {
                
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_TokenConfiguration>>("TokenGeneration/GetAllConfigureTokens");
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
        [Area("Egypt")]
        [HttpPost]
        public async Task<JsonResult> GenerateToken(DO_TokenGeneration obj)
        {
            try
            {
                // obj.TokenAreaCode = "L1";
                //obj.TokenArea = tokenArea;
                
                obj.TokenType = string.IsNullOrEmpty(obj.TokenType) ? string.Empty : obj.TokenType;
                obj.TokenKey = string.IsNullOrEmpty(obj.TokenKey) ? string.Empty : obj.TokenKey;
                obj.MobileNumber = string.IsNullOrEmpty(obj.MobileNumber) ? string.Empty : obj.MobileNumber;
                obj.CallingCounter = string.IsNullOrEmpty(obj.CallingCounter) ? string.Empty : obj.CallingCounter;
                obj.TokenStatus = string.IsNullOrEmpty(obj.TokenStatus) ? string.Empty : obj.TokenStatus;
                //obj.ConfirmedTokenType = string.IsNullOrEmpty(obj.ConfirmedTokenType) ? string.Empty : obj.ConfirmedTokenType;
                //obj.ConfirmationUrl = string.IsNullOrEmpty(obj.ConfirmationUrl) ? string.Empty : obj.ConfirmationUrl;
                obj.BusinessKey = 11;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TokenGeneration/GenerateToken", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Status)
                        return Json(new { Status = true, key = serviceResponse.Data.Key, serviceResponse.Data.Message });
                    else
                        return Json(new { Status = false, serviceResponse.Data.Message });
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
    }
}
