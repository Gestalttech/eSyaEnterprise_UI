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
    public class DoctorServiceRateController : Controller
    {
        private readonly IeSyaManageRatesAPIServices _eSyaManageRateAPIServices;
        private readonly ILogger<DoctorServiceRateController> _logger;

        public DoctorServiceRateController(IeSyaManageRatesAPIServices facilityAPIServices, ILogger<DoctorServiceRateController> logger)
        {
            _eSyaManageRateAPIServices = facilityAPIServices;
            _logger = logger;
        }
        #region doctor service rate

        [Area("ManageRates")]
        [ServiceFilter(typeof(ViewBagActionFilter))]

        public async Task<IActionResult> EMR_03_00()
        {
           
            var serviceResponse1 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ClinicServices/GetServicesPerformedByDoctor");
            if (serviceResponse1.Status)
            {
                if (serviceResponse1.Data != null)
                {
                    ViewBag.Services = serviceResponse1.Data.Select(s => new SelectListItem
                    {
                        Value = s.ServiceId.ToString(),
                        Text = s.ServiceDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:EFM_10_00:GetServicesPerformedByDoctor");
            }

            var serviceResponse2 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("CommonMethod/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.RateType);
            if (serviceResponse2.Status)
            {
                if (serviceResponse2.Data != null)
                {
                    ViewBag.RateType = serviceResponse2.Data.Select(r => new SelectListItem
                    {
                        Value = r.ApplicationCode.ToString(),
                        Text = r.CodeDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:EFM_10_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }

            var serviceResponse3 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyCode>>("CommonMethod/GetCurrencyCodes");
            if (serviceResponse3.Status)
            {
                if (serviceResponse3.Data != null)
                {
                    ViewBag.CurrencyCode = serviceResponse3.Data.Select(c => new SelectListItem
                    {
                        Value = c.CurrencyCode.ToString(),
                        Text = c.CurrencyName,
                    }).ToList();
                }

            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:EFM_10_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }


            return View();
        }
        public async Task<ActionResult> GetDoctosbyBusinessKey(int businesskey)
        {
            try
            {
                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyCodes>>("DoctorServiceRate/GetDoctosbyBusinessKey?businesskey=" + businesskey);
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctosbyBusinessKey:For BusinessKey {0} ", businesskey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctosbyBusinessKey:For BusinessKey {0}", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        /// <summary>
        /// Get Doctor Service Rate by Business Key Service Id Currency Code Rate Type and Doctor Id
        /// </summary>
        public async Task<ActionResult> GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType(int businessKey, int serviceId, int doctorId, string currencycode, int ratetype)
        {
            try
            {
                var param = "?businessKey=" + businessKey;
                param += "&serviceId=" + serviceId;
                param += "&doctorId=" + doctorId;
                param += "&currencycode=" + currencycode;
                param += "&ratetype=" + ratetype;

                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_DoctorServiceRate>>("DoctorServiceRate/GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType" + param);
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType:For BusinessKey {0} , DoctorId {1}, CurrencyCode {2} , RateType {3}", businessKey, doctorId, currencycode, ratetype);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType:For BusinessKey {0} , DoctorId {1}, CurrencyCode {2} , RateType {3}", businessKey, doctorId, currencycode, ratetype);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// Insert Or Update into Doctor Service Rate
        /// </summary>
        public async Task<ActionResult> InsertOrUpdateDoctorServiceRate(List<DO_DoctorServiceRate> obj)
        {
            try
            {
                foreach (var doc_visitrate in obj)
                {
                    doc_visitrate.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    doc_visitrate.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    doc_visitrate.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorServiceRate/InsertOrUpdateDoctorServiceRate", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateDoctorServiceRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateDoctorServiceRate:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDoctorServiceRate:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region speciality service rate

        [Area("ManageRates")]
        [ServiceFilter(typeof(ViewBagActionFilter))]

        public async Task<IActionResult> EMR_04_00()
        {
           
            var serviceResponse1 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ClinicServices/GetServicesPerformedByDoctor");
            if (serviceResponse1.Status)
            {
                if (serviceResponse1.Data != null)
                {
                    ViewBag.Services = serviceResponse1.Data.Select(s => new SelectListItem
                    {
                        Value = s.ServiceId.ToString(),
                        Text = s.ServiceDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:V_1517_00:GetServicesPerformedByDoctor");
            }

            var serviceResponse2 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("CommonMethod/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.RateType);
            if (serviceResponse2.Status)
            {
                if (serviceResponse2.Data != null)
                {
                    ViewBag.RateType = serviceResponse2.Data.Select(r => new SelectListItem
                    {
                        Value = r.ApplicationCode.ToString(),
                        Text = r.CodeDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:V_1518_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }

            var serviceResponse3 = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyCode>>("CommonMethod/GetCurrencyCodes");
            if (serviceResponse3.Status)
            {
                if (serviceResponse3.Data != null)
                {
                    ViewBag.CurrencyCode = serviceResponse3.Data.Select(c => new SelectListItem
                    {
                        Value = c.CurrencyCode.ToString(),
                        Text = c.CurrencyName,
                    }).ToList();
                }

            }
            else
            {
                _logger.LogError(new Exception(serviceResponse1.Message), "UD:V_1518_00:GetApplicationCodesByCodeType: CodeType {0} 62");
            }


            return View();
        }

        public async Task<ActionResult> GetSpecialitesbyBusinessKey(int businesskey)
        {
            try
            {
                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyCodes>>("ClinicServices/GetSpecialitesbyBusinessKey?businesskey=" + businesskey);
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

        /// <summary>
        /// Get Doctor Service Rate by Business Key Service Id Currency Code Rate Type and Doctor Id
        /// </summary>
        public async Task<ActionResult> GetSpecialtyServiceRateByBKeyServiceIdCurrCodeRateType(int businessKey, int serviceId, int specialtyId, string currencycode, int ratetype)
        {
            try
            {
                var param = "?businessKey=" + businessKey;
                param += "&serviceId=" + serviceId;
                param += "&specialtyId=" + specialtyId;
                param += "&currencycode=" + currencycode;
                param += "&ratetype=" + ratetype;

                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.GetAsync<List<DO_SpecialityServiceRate>>("DoctorServiceRate/GetSpecialtyServiceRateByBKeyServiceIdCurrCodeRateType" + param);
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSpecialtyServiceRateByBKeyServiceIdCurrCodeRateType:For BusinessKey {0} , specialtyId {1}, CurrencyCode {2} , RateType {3}", businessKey, specialtyId, currencycode, ratetype);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyServiceRateByBKeyServiceIdCurrCodeRateType:For BusinessKey {0} , specialtyId {1}, CurrencyCode {2} , RateType {3}", businessKey, specialtyId, currencycode, ratetype);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }

        /// <summary>
        /// Insert Or Update into Specialty Service Rate
        /// </summary>
        public async Task<ActionResult> InsertOrUpdateSpecialityServiceRate(List<DO_SpecialityServiceRate> obj)
        {
            try
            {
                foreach (var doc_visitrate in obj)
                {
                    doc_visitrate.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    doc_visitrate.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    doc_visitrate.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaManageRateAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorServiceRate/InsertOrUpdateSpecialityServiceRate", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateSpecialityServiceRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateSpecialityServiceRate:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSpecialityServiceRate:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        #endregion
    }
}
