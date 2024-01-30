using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Stores.Data;
using eSyaEnterprise_UI.Areas.Stores.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;

namespace eSyaEnterprise_UI.Areas.Stores.Controllers
{
    [SessionTimeout]
    public class RulesController : Controller
    {

        private readonly IeSyaStoreAPIServices _eSyaStoreAPIServices;
        private readonly ILogger<RulesController> _logger;
        public RulesController(IeSyaStoreAPIServices eSyaStoreAPIServices, ILogger<RulesController> logger)
        {
            _eSyaStoreAPIServices = eSyaStoreAPIServices;
            _logger = logger;
        }
        #region Inventory Rules
        //Inventory Rules
        [Area("Stores")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAD_05_00()
        {
            return View();
        }

        /// <summary>
        /// Getting Inventory Rules for Grid
        /// </summary>
        [Area("Stores")]
        [HttpPost]
        public async Task<JsonResult> GetInventoryRules()
        {
            try
            {
                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<List<DO_InventoryRules>>("InventoryRules/GetInventoryRules");
                if (serviceResponse.Status)
                {

                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetInventoryRules");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetInventoryRules");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [Area("Stores")]
        /// <summary>
        /// Insert or Update Inventory Rules
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateInventoryRules(DO_InventoryRules rule)
        {

            try
            {
                rule.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                rule.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                rule.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (rule.Isadd == 1)
                {

                    var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("InventoryRules/InsertInventoryRule", rule);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("InventoryRules/UpdateInventoryRule", rule);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateInventoryRules:params:" + JsonConvert.SerializeObject(rule));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Inventory Rules
        /// </summary>
        [Area("Stores")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveInventoryRules(bool status, string InventoryId)
        {

            try
            {

                var parameter = "?status=" + status + "&InventoryId=" + InventoryId;
                var serviceResponse = await _eSyaStoreAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("InventoryRules/ActiveOrDeActiveInventoryRules" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveInventoryRules:For InventoryId {0} ", InventoryId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Inventory Rules
    }
}
