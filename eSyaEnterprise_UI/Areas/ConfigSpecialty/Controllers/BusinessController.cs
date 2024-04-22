using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Data;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Controllers
{
    [SessionTimeout]
    public class BusinessController : Controller
    {
        private readonly IeSyaConfigSpecialtyAPIServices _eSyaConfigSpecialtyAPIServices;
        private readonly ILogger<BusinessController> _logger;

        public BusinessController(IeSyaConfigSpecialtyAPIServices eSyaConfigSpecialtyAPIServices, ILogger<BusinessController> logger)
        {
            _eSyaConfigSpecialtyAPIServices = eSyaConfigSpecialtyAPIServices;
            _logger = logger;
        }
        #region Business Specialty Link

        [Area("ConfigSpecialty")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_05_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole
            {
                IsInsert = true,
                IsEdit = true,
                IsDelete = true,
                IsView = true
            };
            var responseBk = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey").Result;
            if (responseBk.Status)
            {
                if (responseBk.Data != null)
                {
                    ViewBag.BusinessKeyList = responseBk.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                }
            }

            //ViewBag.SpecialtyParameter = ParameterValues.SpecialtyParameter;

            ViewBag.formName = "Business Specialty Link";
            return View();
        }


        /// <summary>
        ///Get Specialty Codes for Tree View
        /// </summary>
        [Area("ConfigSpecialty")]
        [Produces("application/json")]
        public IActionResult GetSpecialtyLinkTree(int businessKey)
        {

            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyBusinessLink>>("Specialty/GetSpecialtyBusinessList?businessKey=" + businessKey).Result;
                List<DO_SpecialtyBusinessLink> data = response.Data;

                List<jsTreeObject> SpecialtyTree = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                jsTreeObject obj;

                foreach (DO_SpecialtyBusinessLink lst in data)
                {
                    obj = new jsTreeObject
                    {
                        parent = "#",
                        text = lst.SpecialtyDesc
                    };
                    var cl = data.Where(w => w.SpecialtyID == lst.SpecialtyID && w.BusinessKey == businessKey && w.ActiveStatus).FirstOrDefault();
                    if (cl != null)
                    {
                        obj.id = "Y" + lst.SpecialtyID.ToString();
                        obj.icon = baseURL + "/images/jsTree/checkedstate.jpg";
                    }
                    else
                    {
                        obj.id = "N" + lst.SpecialtyID.ToString();
                    }
                    /*if (cl == null)
                        obj.state = new stateObject { opened = false, Checked = false, checkbox_disabled = true };
                    else
                        obj.state = new stateObject { opened = false, Checked = true, checkbox_disabled = true };*/

                    SpecialtyTree.Add(obj);
                }

                return Json(SpecialtyTree);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyLinkTree");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Specialty Clinic Link
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult InsertSpecialtyClinicLink(DO_SpecialtyClinicLink obj)
        {
            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/InsertSpecialtyClinicLink", obj).Result;
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSpecialtyClinicLink:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Specialty Clinic Link
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult InsertSpecialtyBusinessLinkList(DO_SpecialtyBusinessLink obj, List<DO_SpecialtyParameter> objPar, int specialtyId, int businessKey)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                objPar.All(c =>
                {
                    c.BusinessKey = businessKey;
                    c.SpecialtyID = specialtyId;
                    c.ActiveStatus = true;
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                DO_SpecialtyBusiness objBus = new DO_SpecialtyBusiness { SpecialtyBusiness = obj, SpecialtyParam = objPar };

                var Insertresponse = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/InsertSpecialtyBusinessLinkList", objBus).Result;
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSpecialtyBusinessLinkList:Params:" + JsonConvert.SerializeObject(new DO_SpecialtyBusiness { SpecialtyBusiness = obj, SpecialtyParam = objPar }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Specialty Clinic Link
        /// </summary>
        [HttpPost]
        public JsonResult UpdateSpecialtyClinicLink(DO_SpecialtyClinicLink obj)
        {
            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/UpdateSpecialtyClinicLink", obj).Result;
                return Json(response.Data);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateSpecialtyClinicLink:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Specialty Clinic Link
        /// </summary>
        [HttpGet]
        public JsonResult GetSpecialtyClinicLink(int businessKey, int specialtyId)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyClinicLink>>("Specialty/GetSpecialtyClinicLinkList?businessKey=" + businessKey + "&specialtyId=" + specialtyId).Result;

                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetSpecialtyClinicLink:businessKey:{0}, specialtyId: {1}", businessKey, specialtyId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyClinicLink:businessKey:{0}, specialtyId: {1}", businessKey, specialtyId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Get Specialty Codes Detail
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult GetSpecialtyCode(int specialtyId)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<DO_SpecialtyCodes>("SpecialtyCodes/GetSpecialtyCodes?specialtyId=" + specialtyId).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetSpecialtyCode");
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Get Specialty parameter
        /// </summary>
        [Area("ConfigSpecialty")]
        [HttpPost]
        public JsonResult GetSpecialtyParameter(int businessKey, int specialtyId)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyParameter>>("Specialty/GetSpecialtyParameterList?businessKey=" + businessKey + "&specialtyId=" + specialtyId).Result;

                return Json(response.Data);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyParameter:businessKey:{0}, specialtyId: {1}", businessKey, specialtyId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Clinic List From Application Codes
        /// </summary>
        [HttpPost]
        public JsonResult GetClinicList()
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.Clinic).Result;

                return Json(response.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Specialty List From Specialty Business Link
        /// UI-Doctor Specialty Link
        /// </summary>
        [HttpPost]
        public JsonResult GetSpecialtyListForBusinessKey(int businessKey)
        {
            try
            {
                var response = _eSyaConfigSpecialtyAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyBusinessLink>>("Specialty/GetSpecialtyListForBusinessKey?businessKey=" + businessKey).Result;
                return Json(response.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
