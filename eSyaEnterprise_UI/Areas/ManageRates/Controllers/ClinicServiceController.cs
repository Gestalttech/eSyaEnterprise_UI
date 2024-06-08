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
    public class ClinicServiceController : Controller
    {
        private readonly IeSyaManageRatesAPIServices _eSyaManageRatesAPIServices;
        private readonly ILogger<ClinicServiceController> _logger;

        public ClinicServiceController(IeSyaManageRatesAPIServices facilityAPIServices, ILogger<ClinicServiceController> logger)
        {
            _eSyaManageRatesAPIServices = facilityAPIServices;
            _logger = logger;
        }
        #region Clinic Rate

        /// <summary>
        /// </summary>
        /// <returns></returns>

        [Area("ManageRates")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMR_02_00()
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
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1518_00:GetBusinessKey");
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
                _logger.LogError(new Exception(serviceResponse2.Message), "UD:V_1518_00:GetCurrencyCodes");
            }
            var serviceResponse3 = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("CommonMethod/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.RateType);
            if (serviceResponse3.Status)
            {
                if (serviceResponse3.Data != null)
                {
                    ViewBag.RateType = serviceResponse3.Data.Select(r => new SelectListItem
                    {
                        Value = r.ApplicationCode.ToString(),
                        Text = r.CodeDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse3.Message), "UD:V_1518_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }

            return View();

        }
        public async Task<ActionResult> GetClinicTypesbyBusinessKey(int businesskey)
        {
            try
            {
                var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("DoctorServiceRate/GetClinicTypesbyBusinessKey?businesskey=" + businesskey);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ClinicVisitRate_list = serviceResponse.Data;
                        return Json(ClinicVisitRate_list);
                    }
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicTypesbyBusinessKey:For BusinessKey {0} ", businesskey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicTypesbyBusinessKey:For BusinessKey {0}", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> GetClinicVisitRateByBKeyClinicTypeCurrCodeRateType(int businessKey, int clinictype, string currencycode, int ratetype)
        {
            try
            {
                var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.GetAsync<List<DO_ClinicVisitRate>>("ClinicServices/GetClinicVisitRateByBKeyClinicTypeCurrCodeRateType?businessKey=" + businessKey + "&clinictype=" + clinictype + "&currencycode=" + currencycode + "&ratetype=" + ratetype);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ClinicVisitRate_list = serviceResponse.Data;
                        return Json(ClinicVisitRate_list);
                    }
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicVisitRateByBKeyClinicTypeCurrCode:For BusinessKey {0} , ClinicType {1}, CurrencyCode {2} , RateType {3}", businessKey, clinictype, currencycode, ratetype);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicVisitRateByBKeyClinicTypeCurrCode:For BusinessKey {0} , ClinicType {1}, CurrencyCode {2} , RateType {3}", businessKey, clinictype, currencycode, ratetype);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> AddOrUpdateClinicVisitRate(List<DO_ClinicVisitRate> obj)
        {
            try
            {
                foreach (var c_visitrate in obj)
                {
                    c_visitrate.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    c_visitrate.CreatedOn = DateTime.Now;
                    c_visitrate.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c_visitrate.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaManageRatesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ClinicServices/AddOrUpdateClinicVisitRate", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateClinicVisitRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateClinicVisitRate:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateClinicVisitRate:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
