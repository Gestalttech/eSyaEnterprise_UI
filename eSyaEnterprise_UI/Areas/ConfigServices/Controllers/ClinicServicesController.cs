using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigServices.Data;
using eSyaEnterprise_UI.Areas.ConfigServices.Models;
using eSyaEnterprise_UI.Areas.Localize.Data;
using eSyaEnterprise_UI.Areas.Localize.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigServices.Controllers
{
    [SessionTimeout]
    public class ClinicServicesController : Controller
    {
        private readonly IeSyaLocalizeAPIServices _eSyalocalizeAPIServices;

        private readonly IeSyaConfigServicesAPIServices _eSyaConfigServicesAPIServices;
        private readonly ILogger<ClinicServicesController> _logger;
        public ClinicServicesController(IeSyaConfigServicesAPIServices eSyaConfigServicesAPIServices, IeSyaLocalizeAPIServices eSyalocalizeAPIServices, ILogger<ClinicServicesController> logger)
        {
            _eSyaConfigServicesAPIServices = eSyaConfigServicesAPIServices;
            _eSyalocalizeAPIServices = eSyalocalizeAPIServices;
            _logger = logger;
        }
        #region ServiceCode
        //IeSyaManageServicesAPIServices
        /// <summary>
        /// Service Code
        /// </summary>
        /// <returns></returns>

        [Area("ConfigServices")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMS_01_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsView = true, IsDelete = true };

            var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.ServiceFor);
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.Servicesfor = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1511_00:GetBusinessKey");
            }
            return View();
        }

        public async Task<ActionResult> GetServiceCodes()
        {
            try
            {
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceType>>("ServiceCodes/GetServiceTypes");
                var st_list = new List<DO_ServiceType>();
                if (serviceResponse.Status)
                {
                    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceCodes:GetServiceTypes");
                }
                var serviceResponse1 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceCodes/GetServiceGroups");
                var sg_list = new List<DO_ServiceGroup>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetServiceCodes:GetServiceGroups");
                }
                var serviceResponse2 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceClass>>("ServiceCodes/GetServiceClasses");
                var sc_list = new List<DO_ServiceClass>();
                if (serviceResponse2.Status)
                {
                    sc_list = serviceResponse2.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetServiceCodes:GetServiceClasses");
                }
                var serviceResponse3 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ServiceCodes/GetServiceCodes");
                var sm_list = new List<DO_ServiceCode>();
                if (serviceResponse3.Status)
                {
                    sm_list = serviceResponse3.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse3.Message), "UD:GetServiceCodes:GetServiceCodes");
                }
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "SM";
                jsObj.parent = "#";
                jsObj.text = "Services";
                jsObj.icon = "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (st_list != null)
                {
                    foreach (var st in st_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = "T" + st.ServiceTypeId.ToString();
                        jsObj.text = st.ServiceTypeDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SM";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (sg_list != null)
                        {
                            foreach (var sg in sg_list)
                            {
                                if (st.ServiceTypeId == sg.ServiceTypeId)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = "G" + sg.ServiceGroupId.ToString();
                                    jsObj.text = sg.ServiceGroupDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                    jsObj.parent = "T" + st.ServiceTypeId.ToString();
                                    jsObj.state = new stateObject { opened = false, selected = false };
                                    treeView.Add(jsObj);


                                    if (sc_list != null)
                                    {
                                        foreach (var sc in sc_list)
                                        {
                                            if (sg.ServiceGroupId == sc.ServiceGroupId)
                                            {
                                                if (sc.ServiceClassId == sc.ParentId)
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.ServiceClassId.ToString();
                                                    jsObj.text = sc.ServiceClassDesc;
                                                    jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                                    jsObj.parent = "G" + sg.ServiceGroupId.ToString();
                                                    treeView.Add(jsObj);
                                                }
                                                else
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.ServiceClassId.ToString();
                                                    jsObj.text = sc.ServiceClassDesc;
                                                    jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                                    jsObj.parent = "C" + sc.ParentId.ToString();
                                                    treeView.Add(jsObj);
                                                }
                                                if (sm_list != null)
                                                {
                                                    foreach (var sm in sm_list)
                                                    {
                                                        if (sc.ServiceClassId == sm.ServiceClassId)
                                                        {
                                                            jsObj = new jsTreeObject();
                                                            jsObj.id = sm.ServiceId.ToString();
                                                            jsObj.text = sm.ServiceDesc;
                                                            jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                            jsObj.parent = "C" + sc.ServiceClassId.ToString();
                                                            treeView.Add(jsObj);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceCodes");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
                throw ex;
            }



        }
        public async Task<ActionResult> GetServiceCodeByID(int ServiceID)
        {
            try
            {
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<DO_ServiceCode>("ServiceCodes/GetServiceCodeByID?ServiceID=" + ServiceID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceCodeByID:For ServiceID {0}", ServiceID);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceCodeByID:For ServiceID {0}", ServiceID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceCodeByID:For ServiceID {0}", ServiceID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateServiceCode(DO_ServiceCode obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceCodes/AddOrUpdateServiceCode", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceCode:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceCode:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceCode:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region ClinicServiceLink

        /// <summary>
        /// Clinic Service Link
        /// </summary>
        /// <returns></returns>

        [Area("ConfigServices")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMS_04_00()
        {
            //var businessserviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ClinicServices/GetActiveServices");

            string uiCulture = Thread.CurrentThread.CurrentUICulture.ToString();
            if (uiCulture != null)
            {
                if (uiCulture == "en-US")
                {
                    var businessserviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                    if (businessserviceResponse.Status)
                    {
                        ViewBag.BusinessKey = businessserviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.BusinessKey.ToString(),
                            Text = b.LocationDescription,
                        }).ToList();
                    }
                }
                if (uiCulture == "hi-IN")
                {
                    var parameter = "?languageCode=" + uiCulture + "&tableCode=" +2;
                    var hindiserviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LocalizationLanguageMapping>>("Master/GetLocalizationLanguageMapping" + parameter);
                    if (hindiserviceResponse.Status)
                    {
                        ViewBag.BusinessKey = hindiserviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.TablePrimaryKeyId.ToString(),
                            Text = b.FieldDescLanguage,
                        }).ToList();
                    }
                }
                if (uiCulture == "ar-EG")
                {
                    var parameter = "?languageCode=" + uiCulture + "&tableCode=" + 2;
                    var arabicserviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LocalizationLanguageMapping>>("Master/GetLocalizationLanguageMapping" + parameter);
                    if (arabicserviceResponse.Status)
                    {
                        ViewBag.BusinessKey = arabicserviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.TablePrimaryKeyId.ToString(),
                            Text = b.FieldDescLanguage,
                        }).ToList();
                    }
                }
            }
                

            

            if (/*businessserviceResponse.Status &&*/ serviceResponse.Status)
            {
                //if (businessserviceResponse.Data != null)
                //{
                //    ViewBag.BusinessKey = businessserviceResponse.Data.Select(b => new SelectListItem
                //    {
                //        Value = b.BusinessKey.ToString(),
                //        Text = b.LocationDescription,
                //    }).ToList();
                //}
                if (serviceResponse.Data != null)
                {
                    ViewBag.Services = serviceResponse.Data.Select(s => new SelectListItem
                    {
                        Value = s.ServiceId.ToString(),
                        Text = s.ServiceDesc,
                    }).ToList();
                }
            }
            
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:EMS_04_00:GetActiveServices");
            }

            return View();

        }
        [HttpGet]
        public async Task<ActionResult> GetClinicServiceLinkbyBusinesskey(int businessKey)
        {
            try
            {
                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_MapClinicServiceLink>>("ClinicServices/GetClinicServiceLinkbyBusinesskey" + parameter);
                if (serviceResponse.Status)
                {
                    var ClinicServiceLink_list = serviceResponse.Data;
                    return Json(ClinicServiceLink_list);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicServiceLinkbyBusinesskey:For BusinessKey {0} ", businessKey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicServiceLinkbyBusinesskey:For BusinessKey {0} ", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetClinicbyBusinesskey(int businessKey)
        {
            try
            {
                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ClinicServices/GetClinicbyBusinesskey"+ parameter);
                var ct_list = new List<DO_ApplicationCodes>();
                if (serviceResponse.Status)
                {
                    ct_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicbyBusinesskey: businessKey{0}", businessKey);
                }




                return Json(ct_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:businessKey: businessKey{0}", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        [HttpPost]
        public async Task<ActionResult> GetConsultationbyClinicIdandBusinesskey(int clinicId, int businessKey)
        {
            try
            {
                var parameter = "?clinicId=" + clinicId + "&businessKey=" + businessKey;

                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ClinicServices/GetConsultationbyClinicIdandBusinesskey" + parameter);
                var ct_list = new List<DO_ApplicationCodes>();
                if (serviceResponse.Status)
                {
                    ct_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetConsultationbyClinicIdandBusinesskey: clinicId{0}", clinicId);
                }




                return Json(ct_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetConsultationbyClinicIdandBusinesskey: clinicId{0}", clinicId);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        public async Task<ActionResult> AddOrUpdateClinicServiceLink(DO_MapClinicServiceLink obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ClinicServices/AddOrUpdateClinicServiceLink", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateClinicServiceLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateClinicServiceLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
