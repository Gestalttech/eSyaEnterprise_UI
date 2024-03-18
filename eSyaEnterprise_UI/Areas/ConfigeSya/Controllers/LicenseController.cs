using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Controllers;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Data;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Areas.ConfigeSya.Data;
using eSyaEnterprise_UI.Areas.ConfigeSya.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Text;

namespace eSyaEnterprise_UI.Areas.ConfigeSya.Controllers
{
    [SessionTimeout]
    public class LicenseController : Controller
    {
        private readonly IeSyaConfigeSyaAPIServices _eSyaConfigeSyaAPIServices;
        private readonly ILogger<LicenseController> _logger;


        public LicenseController(IeSyaConfigeSyaAPIServices eSyaConfigeSyaAPIServices, ILogger<LicenseController> logger)
        {
            _eSyaConfigeSyaAPIServices = eSyaConfigeSyaAPIServices;
            _logger = logger;
        }

        #region New Business Location
        /// <summary>
        /// Business Location
        /// </summary>
        /// <returns></returns>
        /// 
        [Area("ConfigeSya")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECE_01_00()
        {
            try
            {
                ///Getting Business Key
                var Bk_response = await _eSyaConfigeSyaAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("License/GetActiveLocationsforLicenses");

                if (Bk_response.Status)
                {
                    if (Bk_response.Data != null)
                    {
                        ViewBag.BusinessKeyList = Bk_response.Data.Select(b => new SelectListItem
                        {
                            Value = b.BusinessKey.ToString(),
                            Text = b.LocationDescription.ToString(),
                        }).ToList();
                    }
                    else
                    {
                        _logger.LogError(new Exception(Bk_response.Message), "UD:BusinessSubscription");
                    }
                }
                else
                {
                    _logger.LogError(new Exception(Bk_response.Message), "UD:BusinessSubscription");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:BusinessSubscription");
                throw;
            }
        }


        #region Location License Info
        /// <summary>
        ///Get Location License Info by BusinessKey
        /// </summary>
        [Area("ConfigeSya")]
        [HttpPost]
        public async Task<JsonResult> GetLocationLicenseInfo(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigeSyaAPIServices.HttpClientServices.GetAsync<List<DO_LocationLicenseInfo>>("License/GetLocationLicenseInfo?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationLicenseInfo:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationLicenseInfo:For BusinessKey {0} BusinessKey", BusinessKey);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Location License Info
        /// </summary>
        [Area("ConfigeSya")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateLocationLicenseInfo(DO_LocationLicenseInfo obj)
        {
            try
            {
                if (obj.EBusinessKey == null)
                {
                    obj.EBusinessKey = Encoding.ASCII.GetBytes("0");
                }
                if (obj.EActiveUsers == null)
                {
                    obj.EActiveUsers = Encoding.ASCII.GetBytes("0");
                }
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaConfigeSyaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdateLocationLicenseInfo", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateLocationLicenseInfo:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateLocationLicenseInfo:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion




        #endregion


        #region Business Subscription
        /// <summary>
        /// Business Subscription
        /// </summary>
        /// <returns></returns>
        /// 
        [Area("ConfigeSya")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECE_02_00()
        {
            try
            {
                ///Getting Business Key
                var Bk_response = await _eSyaConfigeSyaAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");

                if (Bk_response.Status)
                {
                    if (Bk_response.Data != null)
                    {
                        ViewBag.BusinessKeyList = Bk_response.Data.Select(b => new SelectListItem
                        {
                            Value = b.BusinessKey.ToString(),
                            Text = b.LocationDescription.ToString(),
                        }).ToList();
                    }
                    else
                    {
                        _logger.LogError(new Exception(Bk_response.Message), "UD:BusinessSubscription");
                    }
                }
                else
                {
                    _logger.LogError(new Exception(Bk_response.Message), "UD:BusinessSubscription");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:BusinessSubscription");
                throw;
            }
        }

        /// <summary>
        ///Get Business Subscription by Business Key for Grid
        /// </summary>
        [Area("ConfigeSya")]
        [HttpPost]
        public async Task<JsonResult> GetBusinessSubscription(int BusinessKey)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaConfigeSyaAPIServices.HttpClientServices.GetAsync<List<DO_BusinessSubscription>>("License/GetBusinessSubscription" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSubscription:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSubscription:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessSubscription:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Business Subscription
        /// </summary>
        [Area("ConfigeSya")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinessSubscription(DO_BusinessSubscription busssubs)
        {
            try
            {
                if (string.IsNullOrEmpty(busssubs.BusinessKey.ToString()) || busssubs.BusinessKey == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Business Key" });
                }
                else if (busssubs.SubscribedFrom > busssubs.SubscribedTill)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Subscribed Till Date can't Less Than Subscribed From." });
                }

                else if (busssubs.SubscribedTill < System.DateTime.Now)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Subscribed Till Date can't Less Than Current Date." });
                }
                else
                {
                    busssubs.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    busssubs.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    busssubs.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                    var serviceResponse = await _eSyaConfigeSyaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdateBusinessSubscription", busssubs);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateBusinessSubscription:params:" + JsonConvert.SerializeObject(busssubs));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessSubscription:params:" + JsonConvert.SerializeObject(busssubs));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
