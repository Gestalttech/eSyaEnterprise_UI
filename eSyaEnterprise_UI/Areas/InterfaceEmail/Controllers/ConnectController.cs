using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Areas.InterfaceEmail.Data;
using eSyaEnterprise_UI.Areas.InterfaceEmail.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.InterfaceEmail.Controllers
{
    [SessionTimeout]
    public class ConnectController : Controller
    {
        private readonly IeSyaInterfaceEmailAPIServices _eSyaInterfaceEmailAPIServices;
        private readonly ILogger<ConnectController> _logger;

        public ConnectController(IeSyaInterfaceEmailAPIServices eSyaInterfaceEmailAPIServices, ILogger<ConnectController> logger)
        {
            _eSyaInterfaceEmailAPIServices = eSyaInterfaceEmailAPIServices;
            _logger = logger;
        }

        #region Email Connect
        [Area("InterfaceEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EIF_02_00()
        {
            try
            {
                var serviceResponse = await _eSyaInterfaceEmailAPIServices.HttpClientServices.GetAsync<List<DO_BusinessEntity>>("Connect/GetActiveEntites");
                if (serviceResponse.Status)
                {
                    ViewBag.entity_list = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessId.ToString(),
                        Text = b.BusinessDesc,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveEntites");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveEntites");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Email Connect by Business ID for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetEmailConnectbyBusinessID(int BusinessId)
        {
            try
            {
                var parameter = "?BusinessId=" + BusinessId;
                var serviceResponse = await _eSyaInterfaceEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailConnect>>("Connect/GetEmailConnectbyBusinessID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetEmailConnectbyBusinessID:For BusinessId {0}", BusinessId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetEmailConnectbyBusinessID:For BusinessId {0}", BusinessId);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Email Connect
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateEmailConnect(DO_EmailConnect obj)
        {
            try
            {

                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaInterfaceEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Connect/InsertOrUpdateEmailConnect", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateEmailConnect:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateEmailConnect:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Activate or De Activate SMS Connect
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveEmailConnect(bool status, DO_EmailConnect obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.status = status;
                var serviceResponse = await _eSyaInterfaceEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Connect/ActiveOrDeActiveEmailConnect", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveEmailConnect: ", obj);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
