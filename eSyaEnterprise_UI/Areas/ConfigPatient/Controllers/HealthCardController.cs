using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class HealthCardController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<HealthCardController> _logger;
        public HealthCardController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<HealthCardController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_06_00()
        {
            List<int> l_ac = new List<int>();
            l_ac.Add(ApplicationCodeTypeValues.HealthCareCard);

            var response = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonMethod/GetApplicationCodesByCodeTypeList", l_ac).Result;
            var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
            var cuserviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyCodes>>("CommonMethod/GetActiveCurrencies");
            if (response.Status && serviceResponse.Status && cuserviceResponse.Status)
            {
                List<DO_ApplicationCodes> health = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.HealthCareCard).ToList();
                if (health != null && health.Count > 0)
                {
                    ViewBag.HealthCardList = health.Select(a => new SelectListItem
                    {

                        Value = a.ApplicationCode.ToString(),
                        Text = a.CodeDesc.ToString()
                    });
                }
                ViewBag.BusinessKeyList = serviceResponse.Data.Select(a => new SelectListItem
                {

                    Value = a.BusinessKey.ToString(),
                    Text = a.LocationDescription.ToString()
                });
                ViewBag.CurrencyList = cuserviceResponse.Data.Select(a => new SelectListItem
                {

                    Value = a.CurrencyCode.ToString(),
                    Text = a.CurrencyName.ToString()
                });
            }
            else
            {
                _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
            }
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> GetPatientTypesbyBusinessKey(int businesskey)
        {
            try
            {
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypeAttribute>>("HealthCareCard/GetPatientTypesbyBusinessKey?businesskey=" + businesskey);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientTypesbyBusinessKey:For businessKey ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientTypesbyBusinessKey:For businesskey ", businesskey);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetPatientCategoriesbyPatientType(int businesskey, int patienttypeID)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey+ "&patienttypeID="+ patienttypeID;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypCategoryAttribute>>("HealthCareCard/GetPatientCategoriesbyPatientType" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientCategoriesbyPatientType:For patienttypeID ", patienttypeID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientCategoriesbyPatientType:For patienttypeID ", patienttypeID);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetHealthCareCards(int businesskey, int patienttypeID, int patientcategoryID, int healthcardID)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&patienttypeID=" + patienttypeID + "&patientcategoryID=" + patientcategoryID + "&healthcardID=" + healthcardID;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_HealthCareCard>>("HealthCareCard/GetHealthCareCards" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetHealthCareCards:For healthcardID ", healthcardID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetHealthCareCards:For healthcardID ", healthcardID);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetSpecialtiesLinkedHealthCareCard(int businesskey, int healthcardID)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&healthcardID=" + healthcardID;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_HealthCareCardSpecialtyLink>>("HealthCareCard/GetSpecialtiesLinkedHealthCareCard" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSpecialtiesLinkedHealthCareCard:For healthcardID ", healthcardID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtiesLinkedHealthCareCard:For healthcardID ", healthcardID);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetHealthCareCardRates(int businesskey, int healthcardID)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&healthcardID=" + healthcardID;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_HealthCareCardRates>>("HealthCareCard/GetHealthCareCardRates" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetHealthCareCardRates:For healthcardID ", healthcardID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetHealthCareCardRates:For healthcardID ", healthcardID);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateHealthCareCard(DO_HealthCareCard obj)
        {
            try
            {
                obj.UserID= AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                
                if (obj.lstspecialty != null)
                {
                    obj.lstspecialty.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                        return true;
                    });
                }
               
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("HealthCareCard/InsertOrUpdateHealthCareCard", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateHealthCareCard:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateHealthCareCard:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateHealthCareCardRates(DO_HealthCareCardRates obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("HealthCareCard/InsertOrUpdateHealthCareCardRates", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateHealthCareCardRates:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateHealthCareCardRates:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }
    }
}
