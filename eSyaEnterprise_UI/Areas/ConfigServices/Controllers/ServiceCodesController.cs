using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigServices.Data;
using eSyaEnterprise_UI.Areas.ConfigServices.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Drawing;

namespace eSyaEnterprise_UI.Areas.ConfigServices.Controllers
{
    [SessionTimeout]
    public class ServiceCodesController : Controller
    {
        private readonly IeSyaConfigServicesAPIServices _eSyaConfigServicesAPIServices;
        private readonly ILogger<ServiceCodesController> _logger;

        public ServiceCodesController(IeSyaConfigServicesAPIServices eSyaManageServicesAPIServices, ILogger<ServiceCodesController> logger)
        {
            _eSyaConfigServicesAPIServices = eSyaManageServicesAPIServices;
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

        #region Servive-Business Link-Segment wise
        /// <summary>
        /// Business Location Service Link
        /// </summary>
        /// <returns></returns>
        [Area("ConfigServices")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMS_02_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsView = true, IsDelete = true };

            var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1511_00:GetBusinessKey");
            }
            return View();
        }
        public async Task<ActionResult> GetServiceBusinessLink(int businessKey)
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLink:GetServiceTypes");
                }
                var serviceResponse1 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceCodes/GetServiceGroups");
                var sg_list = new List<DO_ServiceGroup>();
                if (serviceResponse.Status)
                {
                    sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLink:GetServiceGroups");
                }
                var serviceResponse2 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceClass>>("ServiceCodes/GetServiceClasses");
                var sc_list = new List<DO_ServiceClass>();
                if (serviceResponse.Status)
                {
                    sc_list = serviceResponse2.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLink:GetServiceClasses");
                }
                var serviceResponse3 = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceCode>>("ServiceCodes/GetServiceBusinessLink?businessKey=" + businessKey);
                var sm_list = new List<DO_ServiceCode>();
                if (serviceResponse.Status)
                {
                    sm_list = serviceResponse3.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLink:GetServiceBusinessLink:For BusinessKey {0}", businessKey);
                }
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "SM";
                jsObj.parent = "#";
                jsObj.text = "Services";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false, checkbox_disabled = false };
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
                        jsObj.state = new stateObject { opened = false, selected = false, checkbox_disabled = false };
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
                                    jsObj.state = new stateObject { opened = false, selected = false, checkbox_disabled = false };
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
                                                    jsObj.state = new stateObject { opened = false, selected = false, checkbox_disabled = false };
                                                    treeView.Add(jsObj);
                                                }
                                                else
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.ServiceClassId.ToString();
                                                    jsObj.text = sc.ServiceClassDesc;
                                                    jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                                    jsObj.parent = "C" + sc.ParentId.ToString();
                                                    jsObj.state = new stateObject { opened = false, selected = false, checkbox_disabled = false };
                                                    treeView.Add(jsObj);
                                                }
                                                if (sm_list != null)
                                                {
                                                    foreach (var sm in sm_list)
                                                    {
                                                        if (sc.ServiceClassId == sm.ServiceClassId)
                                                        {
                                                            if (sm.BusinessLinkStatus)
                                                            {
                                                                jsObj = new jsTreeObject();
                                                                jsObj.id = "S" + sm.ServiceId.ToString();
                                                                jsObj.text = sm.ServiceDesc;
                                                                //jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                                jsObj.icon = baseURL + "/images/jsTree/checkedstate.jpg";
                                                                jsObj.parent = "C" + sc.ServiceClassId.ToString();
                                                                jsObj.state = new stateObject { opened = false, selected = sm.BusinessLinkStatus, checkbox_disabled = false };
                                                                treeView.Add(jsObj);
                                                            }
                                                            else
                                                            {
                                                                jsObj = new jsTreeObject();
                                                                jsObj.id = "S" + sm.ServiceId.ToString();
                                                                jsObj.text = sm.ServiceDesc;
                                                                jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                                jsObj.parent = "C" + sc.ServiceClassId.ToString();
                                                                jsObj.state = new stateObject { opened = false, selected = sm.BusinessLinkStatus, checkbox_disabled = false };
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
        public async Task<ActionResult> GetBusinessLocationServices(int businessKey, int serviceId)
        {
            try
            {
                var parameter = "?businessKey=" + businessKey + "&serviceId=" + serviceId;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<DO_ServiceBusinessLink>("ServiceCodes/GetBusinessLocationServices" + parameter);

                
                if (serviceResponse.Status)
                {
                     return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessLocationServices:For BusinessKey {0}", businessKey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessLocationServices:For BusinessKey {0}", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<ActionResult> AddOrUpdateBusinessLocationServices(DO_ServiceBusinessLink obj)
        {
            try
            {

                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ServiceCost = 0;
                obj.ActiveStatus = true;


                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceCodes/AddOrUpdateBusinessLocationServices", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateBusinessLocationServices:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateBusinessLocationServices:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateBusinessLocationServices:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
      
        #endregion

        #region Servive-Business Link-Service wise
        /// <summary>
        /// Service Business Locations
        /// </summary>
        /// <returns></returns>

        [Area("ConfigServices")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EMS_03_00()
        {
            return View();
        }
        public async Task<ActionResult> GetServiceBusinessLocations(int ServiceId)
        {
            try
            {
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<List<DO_ServiceBusinessLink>>("ServiceCodes/GetServiceBusinessLocations?ServiceId=" + ServiceId);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ServiceBusinessLink_list = serviceResponse.Data;
                        return Json(ServiceBusinessLink_list);
                    }
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLocations:For ServiceId {0}", ServiceId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceBusinessLocations:For ServiceId {0}", ServiceId);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> GetServiceBusinessLocationParameters(int serviceId, int businessKey)
        {
            try
            {
                var parameter = "?serviceId=" + serviceId + "&businessKey=" + businessKey;
                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.GetAsync<DO_ServiceBusinessLink>("ServiceCodes/GetServiceBusinessLocationParameters" + parameter);


                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceBusinessLocationParameters:For BusinessKey {0}", businessKey);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceBusinessLocationParameters:For BusinessKey {0}", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> UpdateServiceBusinessLocations(DO_ServiceBusinessLink obj)
        {
            try
            {
               
                    obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    obj.CreatedOn = DateTime.Now;
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    obj.ServiceCost = 0;
                    obj.ActiveStatus = true;


                var serviceResponse = await _eSyaConfigServicesAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceCodes/UpdateServiceBusinessLocations", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateServiceBusinessLocations:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateServiceBusinessLocations:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateServiceBusinessLocations:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

    }
}
