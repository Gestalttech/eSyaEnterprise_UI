﻿using eSyaEnterprise_UI.ActionFilter;
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
    public class DocumentController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<DocumentController> _logger;
        public DocumentController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<DocumentController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }
        #region Map Patient Category to Document	
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_03_00()
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
        /// <summary>
        /// Insert Into Patient Category Document Link
        /// </summary>

        /// <summary>
        ///Get Patient Types for Tree View
        /// </summary>

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


        [Area("ConfigPatient")]
        [HttpPost]
        public async Task<JsonResult> GetPatientTypeCategoryDocumentInfo(int businesskey, int PatientTypeId, int PatientCategoryId)
        {
            try
            {
                DO_PatientTypeCategoryDocumentLink obj = new DO_PatientTypeCategoryDocumentLink()
                {
                    BusinessKey = businesskey,
                    PatientTypeId = PatientTypeId,
                    PatientCategoryId = PatientCategoryId,
                    PatientCatgDocId=ApplicationCodeTypeValues.DocumentListforPatientTypeCategoryLink,
                    FormID = string.Empty,
                    TerminalID = string.Empty

                };
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_PatientTypeCategoryDocumentLink>>("Document/GetPatientTypeCategoryDocumentInfo", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientTypeCategoryDocumentInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", businesskey, PatientTypeId, PatientCategoryId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientTypeCategoryDocumentInfo:For PatientTypeId {0} with PatientCategoryId entered {1}", businesskey, PatientTypeId, PatientCategoryId);
                throw ex;
            }
        }

        /// <summary>
        /// Get Patient Category Document Link
        /// </summary>
        [Area("ConfigPatient")]
        [HttpPost]
        public JsonResult InsertOrUpdatePatientCategoryDocumentLink(List<DO_PatientTypeCategoryDocumentLink> obj)
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

                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Document/InsertOrUpdatePatientCategoryDocumentLink", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:InsertOrUpdatePatientCategoryDocumentLink:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePatientCategoryDocumentLink:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
