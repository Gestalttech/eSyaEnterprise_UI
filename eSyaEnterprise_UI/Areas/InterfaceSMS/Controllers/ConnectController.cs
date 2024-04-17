using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.InterfaceSMS.Data;
using eSyaEnterprise_UI.Areas.InterfaceSMS.Models;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.InterfaceSMS.Controllers
{

    [SessionTimeout]
    public class ConnectController : Controller
    {
        private readonly IeSyaInterfaceSMSAPIServices _eSyaInterfaceSMSAPIServices;
        private readonly ILogger<ConnectController> _logger;

        public ConnectController(IeSyaInterfaceSMSAPIServices eSyaInterfaceSMSAPIServices, ILogger<ConnectController> logger)
        {
            _eSyaInterfaceSMSAPIServices = eSyaInterfaceSMSAPIServices;
            _logger = logger;
        }

        #region SMS Connect
        [Area("InterfaceSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EIF_01_00()
        {
            try
            {
                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.GetAsync<List<DO_BusinessEntity>>("SMSConnect/GetActiveEntites");
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
        ///Get ISD Code by Business Key
        /// </summary>
        [Area("InterfaceSMS")]
        [HttpPost]
        public async Task<JsonResult> GetLocationISDCodeByBusinessKey(int BusinessKey)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.GetAsync<DO_CountryCodes>("SMSConnect/GetLocationISDCodeByBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationISDCodeByBusinessKey:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationISDCodeByBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationISDCodeByBusinessKey:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }

        /// <summary>
        ///Get Business Locations  By Business ID
        /// </summary>
        [Area("InterfaceSMS")]
        [HttpPost]
        public async Task<JsonResult> GetBusinessLocationByBusinessID(int BusinessId)
        {

            try
            {
                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("SMSConnect/GetBusinessLocationByBusinessID?BusinessId=" + BusinessId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessLocationByBusinessID");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessLocationByBusinessID");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        ///Get SMS Connect by Business ID for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetSMSConnectbyBusinessID(int BusinessId)
        {
            try
            {
                var parameter = "?BusinessId=" + BusinessId;
                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSConnect>>("SMSConnect/GetSMSConnectbyBusinessID" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSMSConnectbyBusinessID:For BusinessId {0}", BusinessId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSMSConnectbyBusinessID:For BusinessId {0}", BusinessId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSMSConnectbyBusinessID:For BusinessId {0}", BusinessId);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update SMS Connect
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateSMSConnect(DO_SMSConnect obj)
        {
            try
            {

                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.User_ID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSConnect/InsertOrUpdateSMSConnect", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateSMSConnect:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSMSConnect:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Activate or De Activate SMS Connect
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveSMSConnect(bool status, DO_SMSConnect obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.User_ID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.status = status;
                var serviceResponse = await _eSyaInterfaceSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSConnect/ActiveOrDeActiveSMSConnect", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveSMSConnect: ", obj);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
