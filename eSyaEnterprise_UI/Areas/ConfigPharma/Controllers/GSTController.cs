using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Reflection.Emit;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class GSTController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<GSTController> _logger;

        public GSTController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<GSTController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }
        #region HSN GST Master
        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPH_08_00()
        {
            try
            {
                var serviceresponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_GST>>("GST/GetHSNCodes");
                if (serviceresponse.Status)
                {
                    ViewBag.HSN = serviceresponse.Data.Select(a => new SelectListItem
                    {
                        Text = a.HSNVal.ToString(),
                        Value = a.HSNVal.ToString()
                    });
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetHSNCodes");
                    return View();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetHSNCodes");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Getting HSN-GST
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetPharmacyGSTPercentages( )
        {
            try
            {
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_GST>>("GST/GetPharmacyGSTPercentages");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPharmacyGSTPercentages ");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Or UpdateHSN-GST
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePharmacyGSTPercentage(DO_GST obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
               
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("GST/InsertOrUpdatePharmacyGSTPercentage", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdatePharmacyGSTPercentage:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                
                


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePharmacyGSTPercentage:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
