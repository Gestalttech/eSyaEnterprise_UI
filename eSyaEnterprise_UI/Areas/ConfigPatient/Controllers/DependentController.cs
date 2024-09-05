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
    public class DependentController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<DependentController> _logger;
        public DependentController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<DependentController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_08_00()
        {
            List<int> l_ac = new List<int>();
            l_ac.Add(ApplicationCodeTypeValues.Relationship);

            var response = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonMethod/GetApplicationCodesByCodeTypeList", l_ac).Result;
            var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
            if (response.Status && serviceResponse.Status)
            {
                List<DO_ApplicationCodes> realtionship = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.Relationship).ToList();
                if (realtionship != null && realtionship.Count > 0)
                {
                    ViewBag.RelationshipList = realtionship.Select(a => new SelectListItem
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
                var parameter = "?businesskey=" + businesskey + "&patienttypeID=" + patienttypeID;
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
        public async Task<JsonResult> GetAllDependents(int businesskey, int patienttypeID, int patientcategoryID)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&patienttypeID=" + patienttypeID + "&patientcategoryID=" + patientcategoryID;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_Dependent>>("Dependent/GetAllDependents" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetHealthCareCards:For healthcardID ");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetHealthCareCards:For healthcardID ");
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePatientDependent(DO_Dependent obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Dependent/InsertOrUpdatePatientDependent", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdatePatientDependent:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePatientDependent:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }
    }
}
