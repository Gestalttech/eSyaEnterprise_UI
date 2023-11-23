using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ManageRates.Data;
using eSyaEnterprise_UI.Areas.ManageRates.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ManageRates.Controllers
{
    [SessionTimeout]
    public class ServiceRatesController : Controller
    {
        private readonly IeSyaManageRatesAPIServices _eSyaManageRatesAPIServices;
        private readonly ILogger<ServiceRatesController> _logger;
        public ServiceRatesController(IeSyaManageRatesAPIServices configureServicesAPIServices, ILogger<ServiceRatesController> logger)
        {
            _eSyaManageRatesAPIServices = configureServicesAPIServices;
            _logger = logger;
        }
        #region ServiceBaseRate
        /// <summary>
        /// Service Base Rate
        /// </summary>
        /// <returns></returns>

        [Area("ManageRates")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMR_01_00()
        {
            var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1514_00:GetBusinessKey");
            }
            var serviceResponse1 = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("CommonMethod/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.RateType);
            if (serviceResponse1.Status)
            {
                if (serviceResponse1.Data != null)
                {
                    ViewBag.RateType = serviceResponse1.Data.Select(r => new SelectListItem
                    {
                        Value = r.ApplicationCode.ToString(),
                        Text = r.CodeDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:V_1514_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }
            var serviceResponse2 = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyCode>>("CommonMethod/GetCurrencyCodes");
            if (serviceResponse2.Status)
            {
                if (serviceResponse2.Data != null)
                {
                    ViewBag.CurrencyCode = serviceResponse2.Data.Select(c => new SelectListItem
                    {
                        Value = c.CurrencyCode.ToString(),
                        Text = c.CurrencyName,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse2.Message), "UD:V_1514_00:GetCurrencyCodes");
            }

            return View();

        }
        [HttpGet]
        public async Task<ActionResult> GetServiceBaseRateByBKeyRateTypeCurrCode(int businessKey, int ratetype, string currencycode)
        {
            try
            {
                var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceBaseRate>>("ServiceRates/GetServiceBaseRateByBKeyRateTypeCurrCode?businessKey=" + businessKey + "&ratetype=" + ratetype + "&currencycode=" + currencycode);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ServiceBaseRate_list = serviceResponse.Data;
                        return Json(ServiceBaseRate_list);
                    }
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGetServiceBaseRateByBKeyRateType:For BusinessKey {0} , RateType {1}, CurrencyCode {2}", businessKey, ratetype, currencycode);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceGetServiceBaseRateByBKeyRateType:For BusinessKey {0} , RateType {1}, CurrencyCode {2}", businessKey, ratetype, currencycode);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddOrUpdateServiceBaseRate(List<DO_ServiceBaseRate> obj)
        {
            try
            {
                foreach (var ser_br in obj)
                {
                    ser_br.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    ser_br.CreatedOn = DateTime.Now;
                    ser_br.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    ser_br.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceRates/AddOrUpdateServiceBaseRate", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceBaseRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceBaseRate:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceBaseRate:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

    }
}
