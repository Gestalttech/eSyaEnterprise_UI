using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ConfigProduct.Data;
using eSyaEnterprise_UI.Areas.ConfigProduct.Models;
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

namespace eSyaEnterprise_UI.Areas.ConfigProduct.Controllers
{
    [SessionTimeout]
    public class ServicesController : Controller
    {

        private readonly IeSyaConfigProductAPIServices _eSyaConfigProductAPIServices;
        private readonly ILogger<ServicesController> _logger;
        public ServicesController(IeSyaConfigProductAPIServices eSyaConfigureServicesAPIServices, ILogger<ServicesController> logger)
        {
            _eSyaConfigProductAPIServices = eSyaConfigureServicesAPIServices;
            _logger = logger;
        }
        #region ServiceType

        /// <summary>
        /// Service Type
        /// </summary>
        /// <returns></returns>

        [Area("ConfigProduct")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_01_00()
        {
            return View();
        }
        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetServiceTypes()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "ST";
                jsObj.parent = "#";
                jsObj.text = "Service Types";
                jsObj.icon = baseURL+"/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceType>>("ServiceManagement/GetServiceTypes");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var st_list = serviceResponse.Data;
                        foreach (var it in st_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = it.ServiceTypeId.ToString();
                            jsObj.text = it.ServiceTypeDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "ST";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceTypes");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceTypes");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message });
            }
        }
        public async Task<ActionResult> GetServiceTypeByID(int ServiceTypeID)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ServiceType>("ServiceManagement/GetServiceTypeByID?ServiceTypeID=" + ServiceTypeID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceTypeByID:For ServiceTypeID {0}", ServiceTypeID);
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceTypeByID:For ServiceTypeID {0}", ServiceTypeID);
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceTypeByID:For ServiceTypeID {0}", ServiceTypeID);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateServiceType(DO_ServiceType obj)
        {
            try
            {
                //obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.FormID = "ESS_01_00";
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceType", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceType:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceType:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> UpdateServiceTypeIndex(int serviceTypeId, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceTypeIndex?serviceTypeId=" + serviceTypeId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateServiceTypeIndex:For serviceTypeId {0},isMoveUp {1},isMoveDown {2} ", serviceTypeId, isMoveUp, isMoveDown);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateServiceTypeIndex:For serviceTypeId {0},isMoveUp {1},isMoveDown {2} ", serviceTypeId, isMoveUp, isMoveDown);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateServiceTypeIndex:For serviceTypeId {0},isMoveUp {1},isMoveDown {2} ", serviceTypeId, isMoveUp, isMoveDown);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteServiceType(int serviceTypeId)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceType?serviceTypeId=" + serviceTypeId);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteServiceType:For serviceTypeId {0} ", serviceTypeId);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteServiceType:For serviceTypeId {0}", serviceTypeId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteServiceType:For serviceTypeId {0} ", serviceTypeId);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region ServiceGroup

        /// <summary>
        /// Service Group
        /// </summary>
        /// <returns></returns>

        [Area("ConfigProduct")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECP_02_00()
        {
            var ServiceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.ServiceCriteria);
            if (ServiceResponse.Status )
            {
                ViewBag.ServiceCriteriaList = ServiceResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.ApplicationCode.ToString(),
                    Text = b.CodeDesc,
                }).ToList();
               
                return View();
            }
            else
            {
                _logger.LogError(new Exception(ServiceResponse.Message), "UD:GetApplicationCodesByCodeType");
                return View();
            }
        }

        public async Task<ActionResult> GetServiceGroups()
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceType>>("ServiceManagement/GetServiceTypes");
                var st_list = new List<DO_ServiceType>();
                if (serviceResponse.Status)
                {
                    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGroups:GetServiceTypes");
                }

                var serviceResponse1 = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceManagement/GetServiceGroups");
                var sg_list = new List<DO_ServiceGroup>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetServiceGroups:GetServiceGroups");
                }

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "SG";
                jsObj.parent = "#";
                jsObj.text = "Service Groups";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (st_list != null)
                {
                    foreach (var st in st_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = st.ServiceTypeId.ToString();
                        jsObj.text = st.ServiceTypeDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SG";
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
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.parent = st.ServiceTypeId.ToString();
                                    treeView.Add(jsObj);
                                }
                            }
                        }
                    }
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceGroups");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        public async Task<ActionResult> GetServiceGroupsByTypeID(int servicetype)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceManagement/GetServiceGroupsByTypeID?servicetype=" + servicetype);
                var sg_list = new List<DO_ServiceGroup>();
                if (serviceResponse.Status)
                {
                    sg_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGroupsByTypeID: typeID{0}", servicetype);
                }




                return Json(sg_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceGroupsByTypeID: typeID{0}", servicetype);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }




        }
        public async Task<ActionResult> GetServiceGroupByID(int ServiceGroupID)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ServiceGroup>("ServiceManagement/GetServiceGroupByID?ServiceGroupID=" + ServiceGroupID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGroupByID:For ServiceGroupID {0}", ServiceGroupID);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGroupByID:For ServiceGroupID {0}", ServiceGroupID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceGroupByID:For ServiceGroupID {0}", ServiceGroupID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateServiceGroup(DO_ServiceGroup obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceGroup", obj);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceGroup:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceGroup:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> UpdateServiceGroupIndex(int serviceTypeId, int serviceGroupId, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceGroupIndex?serviceTypeId=" + serviceTypeId + "&serviceGroupId=" + serviceGroupId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateServiceGroupIndex:For serviceTypeId {0}, serviceGroupId {1},isMoveUp {2},isMoveDown {3} ", serviceTypeId, serviceGroupId, isMoveUp, isMoveDown);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateServiceGroupIndex:For serviceTypeId {0}, serviceGroupId {1},isMoveUp {2},isMoveDown {3} ", serviceTypeId, serviceGroupId, isMoveUp, isMoveDown);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteServiceGroup(int serviceGroupId)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceGroup?serviceGroupId=" + serviceGroupId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteServiceGroup:For serviceGroupId {0} ", serviceGroupId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteServiceGroup:For serviceGroupId {0} ", serviceGroupId);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region ServiceClass

        /// <summary>
        /// Service Class
        /// </summary>
        /// <returns></returns>

        [Area("ConfigProduct")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_03_00()
        {
            return View();
        }

        public async Task<ActionResult> GetServiceClasses()
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceType>>("ServiceManagement/GetServiceTypes");
                var st_list = new List<DO_ServiceType>();
                if (serviceResponse.Status)
                {
                    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClasses:GetServiceTypes");
                }
                var serviceResponse1 = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceManagement/GetServiceGroups");
                var sg_list = new List<DO_ServiceGroup>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetServiceClasses:GetServiceGroups");
                }
                var sc_list = new List<DO_ServiceClass>();
                var serviceResponse2 = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceClass>>("ServiceManagement/GetServiceClasses");
                if (serviceResponse2.Status)
                {
                    sc_list = serviceResponse2.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetServiceClasses:GetServiceClasses");
                }
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsObj.id = "SC";
                jsObj.parent = "#";
                jsObj.text = "Service Classes";
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
                        jsObj.parent = "SC";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (sg_list != null)
                        {
                            foreach (var sg in sg_list)
                            {
                                if (st.ServiceTypeId == sg.ServiceTypeId)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = sg.ServiceGroupId.ToString();
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
                                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                    jsObj.parent = sg.ServiceGroupId.ToString();
                                                    treeView.Add(jsObj);
                                                }
                                                else
                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "C" + sc.ServiceClassId.ToString();
                                                    jsObj.text = sc.ServiceClassDesc;
                                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                    jsObj.parent = "C" + sc.ParentId.ToString();
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

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceClasses");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }



        }
        public async Task<ActionResult> GetServiceClassesByGroupID(int servicegroup)
        {
            try
            {
                var sc_list = new List<DO_ServiceClass>();
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_ServiceClass>>("ServiceManagement/GetServiceClassesByGroupID?servicegroup=" + servicegroup);
                if (serviceResponse.Status)
                {
                    sc_list = serviceResponse.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClasses:GetServiceClassesByGroupID: GroupID{0}", servicegroup);
                }


                return Json(sc_list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceClassesByGroupID: GroupID{0}", servicegroup);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }



        }
        public async Task<ActionResult> GetServiceClassByID(int ServiceClassID)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ServiceClass>("ServiceManagement/GetServiceClassByID?ServiceClassID=" + ServiceClassID);
                if (serviceResponse.Status)
                {
                    var data = serviceResponse.Data;
                    return Json(data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClassByID:For ServiceClassID {0}", ServiceClassID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceClassByID:For ServiceClassID {0}", ServiceClassID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateServiceClass(DO_ServiceClass obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceClass", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateServiceClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> UpdateServiceClassIndex(int serviceGroupId, int serviceClassId, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceClassIndex?serviceGroupId=" + serviceGroupId + "&serviceClassId=" + serviceClassId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateServiceClassIndex:For serviceGroupId {0}, serviceClassId {1},isMoveUp {2},isMoveDown {3} ", serviceGroupId, serviceClassId, isMoveUp, isMoveDown);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateServiceClassIndex:For serviceGroupId {0}, serviceClassId {1},isMoveUp {2},isMoveDown {3} ", serviceGroupId, serviceClassId, isMoveUp, isMoveDown);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateServiceClassIndex:For serviceGroupId {0}, serviceClassId {1},isMoveUp {2},isMoveDown {3} ", serviceGroupId, serviceClassId, isMoveUp, isMoveDown);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> DeleteServiceClass(int serviceClassId)
        {
            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceClass?serviceClassId=" + serviceClassId);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
                        return Json(new { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
