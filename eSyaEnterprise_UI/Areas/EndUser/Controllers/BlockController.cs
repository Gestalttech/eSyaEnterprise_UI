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
    public class BlockController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ILogger<BlockController> _logger;
        public BlockController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ILogger<BlockController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;

            _logger = logger;
        }
        #region BlockUser
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_09_00()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetBlockedUsers()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("Block/GetBlockedUsers");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBlockedUsers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBlockedUsers");
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateBlockSignIn(DO_BlockUser obj)
        {
            try
            {
                obj.BlockSignIn = false;
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ModifiedBy= AppSessionVariables.GetSessionUserID(HttpContext);
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Block/UpdateBlockSignIn", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateBlockSignIn:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateBlockSignIn:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion
    }
}
