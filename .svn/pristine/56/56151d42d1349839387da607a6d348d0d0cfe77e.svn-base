using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.TokenSystem.Data;
using eSyaEnterprise_UI.Areas.TokenSystem.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using eSyaEnterprise_UI.Extension;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Areas.TokenSystem.Controllers
{
    public class DisplaySystemController : Controller
    {
        private readonly IeSyaTokenSystemAPIServices _eSyaTokenSystemAPIServices;
        private readonly ILogger<DisplaySystemController> _logger;

        public DisplaySystemController(IeSyaTokenSystemAPIServices eSyaTokenSystemAPIServices, ILogger<DisplaySystemController> logger)
        {
            _eSyaTokenSystemAPIServices = eSyaTokenSystemAPIServices;
            _logger = logger;
        }
        [Area("TokenSystem")]
        public async Task<IActionResult> ETM_10_00()
        {
            return View();
        }

        [Area("TokenSystem")]
        public IActionResult ETM_100_00()
        {
            return View();
        }
        [Area("TokenSystem")]
        public async Task<IActionResult> ETM_11_00()
        {
            ViewBag.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
            var parameter = "?ipAddress=" + AppSessionVariables.GetIPAddress(HttpContext);
            var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<DO_DisplaySystemConfig>("DisplaySystem/GetDisplayConfigByIPAdddress" + parameter);
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    return new RedirectToActionResult(serviceResponse.Data.DisplayURL, "DisplaySystem", new { businesskey = AppSessionVariables.GetSessionBusinessKey(HttpContext), arrayOfCounterID = serviceResponse.Data.QueryString });
                }
            }

            ViewBag.IPAddress = AppSessionVariables.GetIPAddress(HttpContext);
            return View();
        }
        [Area("TokenSystem")]
        public async Task<IActionResult> ETM_12_00(int businesskey, string arrayOfCounterID)
        {
            ViewBag.BusinessKey = businesskey;
            ViewBag.CounterList = arrayOfCounterID.Split(',').ToList();
            ViewBag.ArrayOfCounters = arrayOfCounterID;
            return View();
        }



        /// <summary>
        /// Getting Tokens for Counter Display
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetTokenForCounterDisplay(int businessKey, string counterList)
        {
            try
            {
                var parameter = "?businessKey=" + AppSessionVariables.GetSessionBusinessKey(HttpContext);
                parameter += "&arrayOfCounterList=" + counterList.ToString();
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_Token>>("DisplaySystem/GetTokenForCounterDisplay" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetTokenForCounterDisplay:params: businessKey:{0},counterList:{1}",
                        AppSessionVariables.GetSessionBusinessKey(HttpContext).ToString(), counterList));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #region IP Config

        public async Task<JsonResult> GetDisplayIPList()
        {
            try
            {
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_DisplaySystemConfig>>("DisplaySystem/GetDisplayIPList");
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetDisplayIPList:params"));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        public async Task<JsonResult> GetDisplayConfigByID(int DisplayId)
        {
            try
            {
                var parameter = "?DisplayId=" + DisplayId;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<DO_DisplaySystemConfig>("DisplaySystem/GetDisplayConfigByID" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, string.Format("UD:GetDisplayConfigByID:params: DisplayId:{0}", DisplayId));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        public async Task<ActionResult> InsertUpdateDisplayConfig(DO_DisplaySystemConfig obj)
        {
            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormID(HttpContext).ToString();
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.CreatedOn = DateTime.Now;

                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DisplaySystem/InsertUpdateDisplayConfig", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Status)
                        return Json(new { Status = true, key = serviceResponse.Data.Key, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage });
                    else
                        return Json(new { Status = false, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage, serviceResponse.Data.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertUpdateDisplayConfig:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUpdateDisplayConfig:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Warning = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        public async Task<ActionResult> DeleteDisplayIPByID(DO_DisplaySystemConfig obj)
        {
            try
            {
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DisplaySystem/DeleteDisplayIPByID", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Status)
                        return Json(new { Status = true, key = serviceResponse.Data.Key, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage });
                    else
                        return Json(new { Status = false, serviceResponse.Data.Warning, serviceResponse.Data.WarningMessage, serviceResponse.Data.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteDisplayIPByID:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteDisplayIPByID:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Warning = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion
    }
}
