using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class ServiceTypeController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<ServiceTypeController> _logger;
        public ServiceTypeController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<ServiceTypeController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }
        #region Map Patient Category - Service Type
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_05_00()
        {
            try
            {


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

        [Produces("application/json")]
        [Area("ConfigPatient")]
        [HttpGet]
        public async Task<JsonResult> GetPatientCategoriesforTreeViewbyPatientType(int PatientTypeId)
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
                var parameter = "?PatientTypeId=" + PatientTypeId;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_PatientAttributes>("Specialty/GetPatientCategoriesforTreeViewbyPatientType" + parameter);
                if (serviceResponse.Status)
                {
                    var PatientCategory = serviceResponse.Data;
                    if (PatientCategory != null)
                    {

                        foreach (var f in PatientCategory.l_PatienTypeCategory.OrderBy(o => o.PatientCategoryId))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "FM" + f.PatientCategoryId.ToString() + "_" + f.PatientCategoryId.ToString(),
                                text = f.Description,
                                GroupIndex = f.PatientCategoryId.ToString(),
                                parent = "MM",

                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                        }
                    }
                    return Json(jsTree);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientCategoriesforTreeViewbyPatientType");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientCategoriesforTreeViewbyPatientType");
                throw ex;
            }
        }
        #endregion
    }
}
