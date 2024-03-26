using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFacilities.Data;
using eSyaEnterprise_UI.Areas.ConfigFacilities.Models;
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
using eSyaEnterprise_UI.ApplicationCodeTypes;
using Microsoft.CodeAnalysis;
namespace eSyaEnterprise_UI.Areas.ConfigFacilities.Controllers
{
    [SessionTimeout]
    public class SpecialtyController : Controller
    {
        private readonly IeSyaFacilityAPIServices _eSyafacilityAPIServices;
        private readonly ILogger<SpecialtyController> _logger;

        public SpecialtyController(IeSyaFacilityAPIServices eSyafacilityAPIServices, ILogger<SpecialtyController> logger)
        {
            _eSyafacilityAPIServices = eSyafacilityAPIServices;
            _logger = logger;
        }
        #region Specialities
        [Area("ConfigFacilities")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_04_00()
        {
            return View();
        }

        /// <summary>
        /// Insert Specialty Codes
        /// </summary>
        [HttpPost]
        public JsonResult InsertSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                obj.lstAgerangeSpecilatyLink.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/InsertSpecialtyCodes", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:InsertSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Specialty Codes
        /// </summary>
        [HttpPost]
        public JsonResult UpdateSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.lstAgerangeSpecilatyLink.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });
                var response = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/UpdateSpecialtyCodes", obj).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:UpdateSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = response.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Delete Specialty Codes
        /// </summary>
        [HttpPost]
        public JsonResult DeleteSpecialtyCodes(DO_SpecialtyCodes obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var response = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyCodes/DeleteSpecialtyCodes", obj).Result;
                if (response.Status)
                    return Json(response.Data);
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:DeleteSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = response.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSpecialtyCodes:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Specialty Codes for Tree View
        /// </summary>
        [Produces("application/json")]
        public IActionResult GetSpecialtyTree()
        {

            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyCodes>>("SpecialtyCodes/GetSpecialtyCodesList").Result;
                List<DO_SpecialtyCodes> data = response.Data;

                List<jsTreeObject> SpecialtyTree = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                jsTreeObject obj;
                obj = new jsTreeObject();

                obj.id = "H0";
                obj.parent = "#";
                obj.text = "Specialty Codes";
                obj.state = new stateObject { opened = true, selected = false };

                SpecialtyTree.Add(obj);

                //List<DO_SpecialtyCodes> aGroup = data.Select(x => new DO_AssetGroup { AssetGroup = x.AssetGroup, AssetGroupID = x.AssetGroupID }).GroupBy(y => y.AssetGroupID, (key, grp) => grp.FirstOrDefault()).ToList();

                foreach (DO_SpecialtyCodes lst in data)
                {
                    obj = new jsTreeObject();

                    obj.id = lst.SpecialtyID.ToString();
                    obj.parent = "H0";
                    obj.text = lst.SpecialtyDesc;
                    if (lst.ActiveStatus)
                        obj.icon = baseURL + "/images/jsTree/checkedstate.jpg";
                    obj.state = new stateObject { opened = false, selected = false };

                    SpecialtyTree.Add(obj);
                }

                return Json(SpecialtyTree);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyTree");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Get Specialty Codes Detail
        /// </summary>
        [HttpPost]
        public JsonResult GetSpecialtyCode(int specialtyId)
        {
            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<DO_SpecialtyCodes>("SpecialtyCodes/GetSpecialtyCodes?specialtyId=" + specialtyId).Result;
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
        /// Get Age Range Matrix Link by SpecialtyId for Grid
        /// </summary>
        [HttpPost]
        public JsonResult GetAgeRangeMatrixLinkbySpecialtyId(int specialtyId)
        {
            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_AgeRangeMatrixSpecialtyLink>>("SpecialtyCodes/GetAgeRangeMatrixLinkbySpecialtyId?specialtyId=" + specialtyId).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetAgeRangeMatrixLinkbySpecialtyId");
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAgeRangeMatrixLinkbySpecialtyId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Business Specialty Link
        [Area("ConfigFacilities")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_05_00()
        {
            var responseBk = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey").Result;
            ViewBag.BusinessKeyList = responseBk.Data.Select(a => new SelectListItem
            {
                Text = a.LocationDescription,
                Value = a.BusinessKey.ToString()
            });

            ViewBag.SpecialtyParameter = ParameterValues.SpecialtyParameter;

            ViewBag.formName = "Business Specialty Link";
            return View();
        }

        /// <summary>
        ///Get Specialty Codes for Tree View
        /// </summary>
        [Produces("application/json")]
        public IActionResult GetSpecialtyLinkTree(int businessKey)
        {

            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyBusinessLink>>("Specialty/GetSpecialtyBusinessList?businessKey=" + businessKey).Result;
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
        [HttpPost]
        public JsonResult InsertSpecialtyClinicLink(DO_SpecialtyClinicLink obj)
        {
            try
            {
                obj.BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/InsertSpecialtyClinicLink", obj).Result;
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

                var Insertresponse = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/InsertSpecialtyBusinessLinkList", objBus).Result;
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

                var response = _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Specialty/UpdateSpecialtyClinicLink", obj).Result;
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
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyClinicLink>>("Specialty/GetSpecialtyClinicLinkList?businessKey=" + businessKey + "&specialtyId=" + specialtyId).Result;

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
        /// Get Specialty parameter
        /// </summary>
        [HttpPost]
        public JsonResult GetSpecialtyParameter(int businessKey, int specialtyId)
        {
            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyParameter>>("Specialty/GetSpecialtyParameterList?businessKey=" + businessKey + "&specialtyId=" + specialtyId).Result;

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
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.Clinic).Result;

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
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyBusinessLink>>("Specialty/GetSpecialtyListForBusinessKey?businessKey=" + businessKey).Result;
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
