using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;


namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class ManufacturerController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<ManufacturerController> _logger;

        public ManufacturerController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<ManufacturerController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }

        #region Drug Manufacturers
        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPH_01_00()
        {
            return View();
        }
            /// <summary>
            ///Get Manufacturer Information 
            /// </summary>
            [HttpPost]
            public async Task<JsonResult> GetManufacturerListByNamePrefix(string manufacturerNamePrefix)
            {
                try
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_Manufacturer>>("Manufacturer/GetManufacturerListByNamePrefix?manufacturerNamePrefix=" + manufacturerNamePrefix);
                    return Json(serviceResponse.Data);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "UD:GetManufacturerListByNamePrefix:For Prefix {0}", manufacturerNamePrefix);
                    throw ex;
                }
            }
        /// <summary>
        /// Insert or Update Manufacturer
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateManufacturer(DO_Manufacturer obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.ManufacturerId == 0)
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Manufacturer/InsertManufacturer", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertManufacturer:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Manufacturer/UpdateManufacturer", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateManufacturer:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                    
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateManufacturer:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Activate or De Activate Manufacturer
        /// </summary>
      
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveManufacturer(bool status, int manufId)
        {

            try
            {

                var parameter = "?status=" + status + "&manufId=" + manufId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Manufacturer/ActiveOrDeActiveManufacturer" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveManufacturer:For manufId {0} ", manufId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }

}

