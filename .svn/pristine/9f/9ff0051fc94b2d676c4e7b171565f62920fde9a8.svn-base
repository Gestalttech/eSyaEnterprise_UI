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
using eSyaEnterprise_UI.ApplicationCodeTypes;

namespace eSyaEnterprise_UI.Areas.TokenSystem.Controllers
{
    public class CounterMappingController : Controller
    {
        private readonly IeSyaTokenSystemAPIServices _eSyaTokenSystemAPIServices;
        private readonly ILogger<CounterMappingController> _logger;

        public CounterMappingController(IeSyaTokenSystemAPIServices TokenSystemAPIServices, ILogger<CounterMappingController> logger)
        {
            _eSyaTokenSystemAPIServices = TokenSystemAPIServices;
            _logger = logger;
        }


        public IActionResult Index()
        {
            return View();
        }

        #region Token Counter
        /// <summary>
        ///  Counter Creating
        /// </summary>
        /// <returns></returns>

        [Area("TokenSystem")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ETM_02_00()
        {
            try
            {
                var serviceresponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_Floor>>("CounterMapping/GetFloorsbyFloorId?codetype=" + ApplicationCodeTypeValues.FloorId);
                if (serviceresponse.Status)
                {
                    ViewBag.Floors = serviceresponse.Data.
                         Select(b => new SelectListItem
                         {
                             Value = b.FloorId.ToString(),
                             Text = b.FloorName,
                         }).ToList();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetFloorsbyFloorId");

                }

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFloorsbyFloorId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Getting Token Counter by businesskey for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetTokenCountersbyBusinessKey(int businesskey)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_CounterCreation>>("CounterMapping/GetTokenCountersbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetTokenCountersbyBusinessKey :For businesskey {0} ", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Token Counter
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateTokenCounter(bool isInsert, DO_CounterCreation obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CounterMapping/InsertIntoTokenCounter", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CounterMapping/UpdateTokenCounter", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateTokenCounter:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Token Counter
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveTokenCounter(bool status, int businesskey, string counternumber)
        {

            try
            {
                var parameter = "?status=" + status + "&businesskey=" + businesskey + "&counternumber=" + counternumber;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("CounterMapping/ActiveOrDeActiveTokenCounter" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveTokenCounter:For status {0} businesskey{1} tokentype{2} tokennumber{3} ", status, businesskey, counternumber);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Counter Mapping
        /// <summary>
        ///  Counter Mapping
        /// </summary>
        /// <returns></returns>

        [Area("TokenSystem")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ETM_03_00()
        {
            try
            {
                var token_resp = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_TokenConfiguration>>("Configure/GetActiveTokens");
                var floor_resp = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_Floor>>("CounterMapping/GetFloorsbyFloorId?codetype=" + ApplicationCodeTypeValues.FloorId);
                if (token_resp.Status)
                {
                    ViewBag.Tokentypes = token_resp.Data.
                         Select(b => new SelectListItem
                         {
                             Value = b.TokenType.ToString(),
                             Text = b.TokenDesc,
                         }).ToList();
                }
                else
                {
                    _logger.LogError(new Exception(token_resp.Message), "UD:GetActiveTokens");

                }
                if (floor_resp.Status)
                {
                    ViewBag.Floors = floor_resp.Data.
                         Select(b => new SelectListItem
                         {
                             Value = b.FloorId.ToString(),
                             Text = b.FloorName,
                         }).ToList();
                }
                else
                {
                    _logger.LogError(new Exception(floor_resp.Message), "UD:GetFloorsbyFloorId");

                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveTokens");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Getting Counter Mapping by businesskey for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCounterMappingbyBusinessKey(int businesskey)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_CounterMapping>>("CounterMapping/GetCounterMappingbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCounterMappingbyBusinessKey :For businesskey {0} ", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Counter Number by floorId for Dropdown
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCounterNumbersbyFloorId(int floorId)
        {
            try
            {
                var parameter = "?floorId=" + floorId;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<List<DO_CounterCreation>>("CounterMapping/GetCounterNumbersbyFloorId" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCounterNumbersbyFloorId :For floorId {0} ", floorId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Counter Generation
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateCounterMapping(bool isInsert, DO_CounterMapping obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CounterMapping/InsertIntoCounterMapping", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CounterMapping/UpdateCounterMapping", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateCounterMapping:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Counter Mapping
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveCounterMapping(bool status, int businesskey, string tokentype, string counternumber)
        {

            try
            {
                var parameter = "?status=" + status + "&businesskey=" + businesskey + "&tokentype=" + tokentype + "&counternumber=" + counternumber;
                var serviceResponse = await _eSyaTokenSystemAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("CounterMapping/ActiveOrDeActiveCounterMapping" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveCounterMapping:For status {0} businesskey{1} tokentype{2} counternumber{3} ", status, businesskey, tokentype, counternumber);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
