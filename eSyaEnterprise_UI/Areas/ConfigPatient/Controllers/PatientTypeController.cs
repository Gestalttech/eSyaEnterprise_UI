using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.ApplicationCodeTypes;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class PatientTypeController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<PatientTypeController> _logger;
        public PatientTypeController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<PatientTypeController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        #region Patient Types
     
        //
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPM_01_00()
        {
            try
            {

                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.PatientCategory);
                //l_ac.Add(ApplicationCodeTypeValues.ConfigPatientRateType);


                var response = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonMethod/GetApplicationCodesByCodeTypeList", l_ac).Result;
                if (response.Status)
                {
                    List<DO_ApplicationCodes> pcat = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.PatientCategory).ToList();
                    ViewBag.PatientCategory = pcat.Select(a => new SelectListItem
                    {
                        Text = a.CodeDesc,
                        Value = a.ApplicationCode.ToString()
                    });

                    //List<DO_ApplicationCodes> prat = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.ConfigPatientRateType).ToList();
                    //ViewBag.RateType = prat.Select(a => new SelectListItem
                    //{
                    //    Text = a.CodeDesc,
                    //    Value = a.ApplicationCode.ToString()
                    //});
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get Patient Types for Tree View
        /// </summary>
        [Produces("application/json")]
        [HttpGet]
        public async Task<JsonResult> GetAllPatientTypesforTreeView()
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "Patient Types",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?CodeType=" + ApplicationCodeTypeValues.PatientType;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_PatientAttributes>("PatientTypes/GetAllPatientTypesforTreeView" + parameter);
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
                            if (f.ActiveStatus)
                            {
                            jsObj = new jsTreeObject
                            {
                                id = "SM" + f.PatientTypeId.ToString() + "_" + f.PatientCategoryId.ToString(),
                                text = f.Description,
                                GroupIndex = f.PatientTypeId.ToString(),
                                parent = "MM" + f.PatientTypeId.ToString(),
                                icon = "/images/jsTree/checkedstate.jpg",
                                state = new stateObject { opened = true, selected = false }
                            };
                            jsTree.Add(jsObj);
                            }
                            else
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
        public async Task<JsonResult> GetPatientCategoryInfo(int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_PatientTypCategoryAttribute>("PatientTypes/GetPatientCategoryInfo" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientCategoryInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", PatientTypeId, PatientCategoryId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientCategoryInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", PatientTypeId, PatientCategoryId);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Patient Category
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePatientCategory(bool isinsert, DO_PatientTypCategoryAttribute obj)
        {
            try
            {
                if (string.IsNullOrEmpty(obj.PatientCategoryId.ToString()) || obj.PatientCategoryId == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Patient Category" });
                }

                else
                {
                    obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    if (isinsert)
                    {
                        var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientTypes/InsertPatientCategory", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertPatientCategory:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientTypes/UpdatePatientCategory", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdatePatientCategory:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePatientCategory:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        #endregion Patient Types

        #region Patient Type & Category Business Link
        //Map Business to Patient types
        [Area("ConfigPatient")]
        public IActionResult EPT_02_00()
        {
            try
            {

                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.ConfigPatientRateType);

                var response = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("Master/GetApplicationCodesByCodeTypeList", l_ac).Result;
                if (response.Status)
                {
                    List<DO_ApplicationCodes> prat = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.ConfigPatientRateType).ToList();
                    ViewBag.RateType = prat;

                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Insert Into Patient Category Business Link
        /// </summary>
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

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdatePatientCategoryBusinessLink", obj);
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
        [HttpPost]
        public async Task<JsonResult> GetAllPatientCategoryBusinessLink(int businesskey)
        {
            try
            {
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientCategoryTypeBusinessLink>>("PatientType/GetAllPatientCategoryBusinessLink?businesskey=" + businesskey);

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

        #region Care Card Details

        //Patient Category Attribute
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPT_03_00()
        {
            try
            {

                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.ConfigPatientRateType);

                var response = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("Master/GetApplicationCodesByCodeTypeList", l_ac).Result;

                if (response.Status)
                {
                    List<DO_ApplicationCodes> prat = response.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.ConfigPatientRateType).ToList();
                    ViewBag.RateType = prat;
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.RateType);
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For RateType {0}", ApplicationCodeTypeValues.ConfigPatientRateType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #region Patient Type + Category – Care Card
        /// <summary>
        /// Insert Into Care Card
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateCareCardPattern(DO_CareCardPattern obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdateCareCardPattern", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateCareCardPattern:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateCareCardPattern:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }

        /// <summary>
        /// Get  Care Card
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCareCardPattern(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_CareCardPattern>("PatientType/GetCareCardPattern" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCareCardPattern:For businessKey ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCareCardPattern:For businesskey ", businesskey);
                throw ex;
            }
        }

        /// <summary>
        /// Get Card Number
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCardNumber()
        {
            try
            {
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<DO_CareCardPattern>("PatientType/GetCardNumber");

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCardNumber");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllPatientCategoryBusinessLink");
                throw ex;
            }
        }
        #endregion

        #region  Document Details
        /// <summary>
        /// Insert Into Patient Category Document Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDocumentDetails(DO_DocumentDetails obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdateDocumentDetails", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateDocumentDetails:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDocumentDetails:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }

        /// <summary>
        /// Get Patient Category  Document Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDocumentDetails(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_DocumentDetails>>("PatientType/GetDocumentDetails" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDocumentDetails:For businessKey ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDocumentDetails:For businesskey ", businesskey);
                throw ex;
            }
        }

        #endregion

        #region Patient Type + – Service Type Wise – Rate Type
        /// <summary>
        /// Get Business Location List
        /// </summary>
        [HttpPost]
        public JsonResult GetPatientTypeCategoryServiceTypeLink(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var response = _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypeCategoryServiceTypeLink>>("PatientType/GetPatientTypeCategoryServiceTypeLink" + parameter).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Doctor Business Link
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdatePatientTypeCategoryServiceType(List<DO_PatientTypeCategoryServiceTypeLink> obj)

        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdatePatientTypeCategoryServiceType", obj).Result;
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion

        #region Patient Type + Category – Restricted Specialty
        /// <summary>
        /// Get Specialty
        /// </summary>
        [HttpPost]
        public JsonResult GetPatientTypeCategorySpecialtyLink(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var response = _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypeCategorySpecialtyLink>>("PatientType/GetPatientTypeCategorySpecialtyLink" + parameter).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Doctor Business Link
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdatePatientTypeCategorySpecialtyLink(List<DO_PatientTypeCategorySpecialtyLink> obj)

        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdatePatientTypeCategorySpecialtyLink", obj).Result;
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion

        #region Patient Type + Category – Dependent
        /// <summary>
        /// Get Specialty
        /// </summary>
        [HttpPost]
        public JsonResult GetPatientTypeCategoryDependent(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&PatientTypeId=" + PatientTypeId + "&PatientCategoryId=" + PatientCategoryId;
                var response = _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientTypeCategoryDependent>>("PatientType/GetPatientTypeCategoryDependent" + parameter).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Dependent
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdatePatientTypeCategoryDependent(List<DO_PatientTypeCategoryDependent> obj)

        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PatientType/InsertOrUpdatePatientTypeCategoryDependent", obj).Result;
                return Json(Insertresponse.Data);

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
        #endregion
    }
}
