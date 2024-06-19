using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.GenerateToken.Data;
using eSyaEnterprise_UI.Areas.GenerateToken.Models;
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
using eSyaEnterprise_UI.Areas.GenerateToken.Controllers;

namespace eSyaEnterprise_UI.Areas.GenerateToken.Controllers
{
    [SessionTimeout]
    public class AddonController : Controller
    {
        private readonly IeSyaGenerateTokenAPIServices _eSyaGenerateTokenAPIServices;
        private readonly ILogger<AddonController> _logger;
        public AddonController(IeSyaGenerateTokenAPIServices eSyaGenerateTokenAPIServices, ILogger<AddonController> logger)
        {
            _eSyaGenerateTokenAPIServices = eSyaGenerateTokenAPIServices;
            _logger = logger;
        }
        #region Add On
        [Area("GenerateToken")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ETM_04_00()
        {
            return View();
        }

        /// <summary>
        /// Getting already Mapped Counters.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetMappedCounterbyBusinessKey(int businesskey)
        {

            try
            {
                var parameter = "?businesskey=" + businesskey;
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_CounterMapping>>("AddOn/GetMappedCounterbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMappedCounterbyBusinessKey:For  {0} ", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Add On Counters.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAddOnMappedCounters(int businesskey, int floorId, string tokenprefix, string counterNo)
        {

            try
            {
                var parameter = "?businesskey=" + businesskey + "&floorId=" + floorId + "&tokenprefix=" + tokenprefix + "&counterNo=" + counterNo;
                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.GetAsync<List<DO_CounterMapping>>("AddOn/GetAddOnMappedCounters" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAddOnMappedCounters:For tokentype {0} {1} ", businesskey, floorId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Or Update Add On Counters
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateAddOnCounters(List<DO_CounterAddOn> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaGenerateTokenAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AddOn/InsertOrUpdateAddOnCounters", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateAddOnCounters:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateAddOnCounters:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion
    }
}
