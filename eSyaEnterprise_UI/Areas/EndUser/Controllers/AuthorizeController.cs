using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class AuthorizeController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly ILogger<AuthorizeController> _logger;
        public AuthorizeController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, IeSyaGatewayServices eSyaGatewayServices, ILogger<AuthorizeController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;
            _eSyaGatewayServices = eSyaGatewayServices;
            _logger = logger;
        }
        #region Authenticate a new user
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_05_00()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetUnAuthenticatedUsers()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("Authorize/GetUnAuthenticatedUsers");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUnAuthenticatedUsers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUnAuthenticatedUsers");
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> AuthenticateUser(DO_Authorize obj)
        {
            try
            {
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ModifiedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.IsUserAuthenticated = true;

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Authorize/AuthenticateUser", obj);

                if (serviceResponse.Status)
                {
                    //DO_SmsParameter sms = new DO_SmsParameter
                    //{
                    //    BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext),
                    //    TEventID = SMSTriggerEventValues.OnSaveClick,
                    //    FormID = AppSessionVariables.GetSessionFormID(HttpContext),
                    //    UserID = obj.UserID,
                    //};
                    //var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendSmsonSaveClick", sms).Result;
                    //if (sr_SMS.Status)
                    //{
                    //    return Json(new { Status = true, serviceResponse.Data.StatusCode });
                    //}
                    //else
                    //{
                    //    _logger.LogError(new Exception(serviceResponse.Message), "UD:Send Welcome Message to UserId {0}", obj.UserID);
                    //    return Json(new { Status = false, StatusCode = "500" });
                    //}

                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion
    }
}
