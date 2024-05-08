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
    public class BusinessController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<BusinessController> _logger;
        public BusinessController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<BusinessController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        #region Map Patient Category to Document	
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_02_00()
        {

            try
            {

                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.RateType);

                var response =_eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonMethod/GetApplicationCodesByCodeTypeList", l_ac).Result;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
                var ptserviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypCategoryAttribute>>("CommonMethod/GetActivePatientTypes");
                if (response.Status && serviceResponse.Status&& ptserviceResponse.Status)
                {
                    List<DO_ApplicationCodes> prat = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.RateType).ToList();
                    ViewBag.RateType = prat;

                    ViewBag.BusinessKeyList = serviceResponse.Data.Select(a => new SelectListItem
                    {
                       
                        Value = a.BusinessKey.ToString(),
                        Text = a.LocationDescription.ToString()
                    });
                    ViewBag.PatientTypeList = ptserviceResponse.Data.Select(a => new SelectListItem
                    {

                        Value = a.PatientTypeId.ToString(),
                        Text = a.Description.ToString()
                    });
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.RateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.RateType);
                return Json(new DO_ResponseParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Insert Into Patient Category Business Link
        /// </summary>
        [Area("ConfigPatient")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePatientCategoryBusinessLink(List<DO_PatientCategoryTypeBusinessLink> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Business/InsertOrUpdatePatientCategoryBusinessLink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdatePatientCategoryBusinessLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePatientCategoryBusinessLink:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }

        /// <summary>
        /// Get Patient Category Business Link
        /// </summary>
        [Area("ConfigPatient")]
        [HttpPost]
        public async Task<JsonResult> GetAllPatientCategoryBusinessLink(int businesskey, int patienttypeId)
        {
            try
            {
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientCategoryTypeBusinessLink>>("Business/GetAllPatientCategoryBusinessLink?businesskey=" + businesskey+ "&patienttypeId="+ patienttypeId);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllPatientCategoryBusinessLink:For businessKey ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllPatientCategoryBusinessLink:For businesskey ", businesskey);
                throw ex;
            }
        }
        #endregion
    }
}
