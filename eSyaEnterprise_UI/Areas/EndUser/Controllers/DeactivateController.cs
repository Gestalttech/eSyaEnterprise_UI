using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class DeactivateController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ILogger<DeactivateController> _logger;
        public DeactivateController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ILogger<DeactivateController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;

            _logger = logger;
        }
        #region Deactivate a  User
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_11_00()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetActivatedUsers()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("DeActivate/GetActivatedUsers");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActivatedUsers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActivatedUsers");
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> DeActivateUser(DO_DeActivated obj)
        {
            try
            {

                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ModifiedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.IsUserDeactivated= true;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DeActivate/DeActivateUser", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeActivateUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeActivateUser:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion
    }
}
