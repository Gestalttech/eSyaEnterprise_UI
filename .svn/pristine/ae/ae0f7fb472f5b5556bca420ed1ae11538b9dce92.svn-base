using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;


namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    public class CompositionController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<ManufacturerController> _logger;

        public CompositionController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<ManufacturerController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }
        #region Generic Composition Link
        [Area("ConfigPharma")]
        public IActionResult EPH_03_00()
        {
            return View();
        }

        /// <summary>
        /// Getting Generic/Composition Link List.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetGenericComposition(string prefix)
        {
            try
            {
                var parameter = "?prefix=" + prefix;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_Composition>>("Generic/GetGenericComposition" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetGenericComposition:For prefix {0} ", prefix);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Add Or Update Generic/Composition Link.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> AddOrUpdateGenericComposition(DO_Composition obj)
        {

            try
            {
                //obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                //obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Generic/AddOrUpdateGenericComposition", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateGenericComposition:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateGenericComposition:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting  Generic/Composition Link.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetGenericCompositionByID(int GenericID, int CompositionID)
        {
            try
            {
                var parameter = "?GenericID=" + GenericID;
                parameter += "&CompositionID=" + CompositionID;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_Composition>("Generic/GetGenericCompositionByID" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetGenericCompositionByID :For GenericID {0} , CompositionID {1} ", GenericID, CompositionID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
        public IActionResult Index()
        {
            return View();
        }
    }
}
