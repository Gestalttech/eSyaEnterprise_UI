using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class SpecialtyController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<SpecialtyController> _logger;
        public SpecialtyController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<SpecialtyController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }
        #region Map Patient Category to Specialty	
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_04_00()
        {

            try
            {

                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.RateType);

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
                var ptserviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypCategoryAttribute>>("CommonMethod/GetActivePatientTypes");
                if (serviceResponse.Status && ptserviceResponse.Status)
                {
                  
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
                    _logger.LogError(new Exception(ptserviceResponse.Message), "UD:GetActivePatientTypes");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActivePatientTypes");
                return Json(new DO_ResponseParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        ///Get Patient Types for Tree View
        /// </summary>
        [Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetAllPatientCategoryforTreeView(int BusinessKey)
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "Patient Category",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_PatientAttributes>("Specialty/GetAllPatientCategoryforTreeView" + parameter);
                if (serviceResponse.Status)
                {
                    var PatientTypes = serviceResponse.Data;
                    if (PatientTypes != null)
                    {
                        foreach (var f in PatientTypes.l_PatientType.OrderBy(o => o.PatientTypeId))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "MM" + f.PatientTypeId.ToString(),
                                text = f.Description,
                                GroupIndex = f.PatientTypeId.ToString(),
                                parent = "MM",
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }

                        foreach (var f in PatientTypes.l_PatienTypeCategory.OrderBy(o => o.PatientTypeId))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "SM" + f.PatientTypeId.ToString() + "_" + f.PatientCategoryId.ToString(),
                                text = f.Description,
                                GroupIndex = f.PatientTypeId.ToString(),
                                parent = "MM" + f.PatientTypeId.ToString(),
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }
                    }
                    return Json(jsTree);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllPatientTypesforTreeView");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllPatientTypesforTreeView");
                throw ex;
            }
        }

        /// <summary>
        ///Get Patient Category Info
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetPatientCategoryInfo(int BusinessKey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey+ "?PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_PatientTypCategoryAttribute>("Specialty/GetPatientCategoryInfo" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientCategoryInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", BusinessKey, PatientTypeId, PatientCategoryId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientCategoryInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", BusinessKey, PatientTypeId, PatientCategoryId);
                throw ex;
            }
        }
        #endregion
    }
}
