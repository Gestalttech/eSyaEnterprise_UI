using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.SAC.Data;
using eSyaEnterprise_UI.Areas.SAC.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.SAC.Controllers
{
    [SessionTimeout]
    public class SACCodesController : Controller
    {
        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACCodesController> _logger;
        public SACCodesController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACCodesController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }
        #region ServiceCodes

        /// <summary>
        /// Service Class
        /// </summary>
        /// <returns></returns>

        [Area("SAC")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_07_00()
        {
            return View();
        }

        //public async Task<ActionResult> GetServiceClasses()
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_ServiceType>>("ServiceManagement/GetServiceTypes");
        //        var st_list = new List<DO_SACClass>();
        //        if (serviceResponse.Status)
        //        {
        //            st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClasses:GetServiceTypes");
        //        }
        //        var serviceResponse1 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_ServiceGroup>>("ServiceManagement/GetServiceGroups");
        //        var sg_list = new List<DO_SACCategory>();
        //        if (serviceResponse1.Status)
        //        {
        //            sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetServiceClasses:GetServiceGroups");
        //        }
        //        var sc_list = new List<DO_SACCodes>();
        //        var serviceResponse2 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCodes>>("ServiceManagement/GetServiceClasses");
        //        if (serviceResponse2.Status)
        //        {
        //            sc_list = serviceResponse2.Data;
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetServiceClasses:GetServiceClasses");
        //        }
        //        List<jsTreeObject> treeView = new List<jsTreeObject>();
        //        jsTreeObject jsObj = new jsTreeObject();

        //        string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

        //        jsObj.id = "SC";
        //        jsObj.parent = "#";
        //        jsObj.text = "Service Classes";
        //        jsObj.icon = "/images/jsTree/foldergroupicon.png";
        //        jsObj.state = new stateObject { opened = true, selected = false };
        //        treeView.Add(jsObj);
        //        if (st_list != null)
        //        {
        //            foreach (var st in st_list)
        //            {
        //                jsObj = new jsTreeObject();
        //                jsObj.id = "T" + st.Sacclass.ToString();
        //                jsObj.text = st.SacclassDesc;
        //                jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
        //                jsObj.parent = "SC";
        //                jsObj.state = new stateObject { opened = false, selected = false };
        //                treeView.Add(jsObj);
        //                if (sg_list != null)
        //                {
        //                    foreach (var sg in sg_list)
        //                    {
        //                        if (st.Sacclass == sg.Sacclass)
        //                        {
        //                            jsObj = new jsTreeObject();
        //                            jsObj.id = sg.Saccategory.ToString();
        //                            jsObj.text = sg.Saccategory;
        //                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
        //                            jsObj.parent = "T" + st.Sacclass.ToString();
        //                            jsObj.state = new stateObject { opened = false, selected = false };
        //                            treeView.Add(jsObj);


        //                            if (sc_list != null)
        //                            {
        //                                foreach (var sc in sc_list)
        //                                {
        //                                    if (sg.Saccategory == sc.Saccategory)
        //                                    {
        //                                        if (sc.Sacclass == sc.ParentId)
        //                                        {
        //                                            jsObj = new jsTreeObject();
        //                                            jsObj.id = "C" + sc.Saccode.ToString();
        //                                            jsObj.text = sc.Sacdescription;
        //                                            jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
        //                                            jsObj.parent = sg.Saccategory.ToString();
        //                                            treeView.Add(jsObj);
        //                                        }
        //                                        else
        //                                        {
        //                                            jsObj = new jsTreeObject();
        //                                            jsObj.id = "C" + sc.Saccode.ToString();
        //                                            jsObj.text = sc.Sacdescription;
        //                                            jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
        //                                            jsObj.parent = "C" + sc.ParentId.ToString();
        //                                            treeView.Add(jsObj);
        //                                        }

        //                                    }
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }

        //        return Json(treeView);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetServiceClasses");
        //        return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
        //    }



        //}
        public async Task<ActionResult> GetServiceClassesByGroupID(int servicegroup)
        {
            try
            {
                var sc_list = new List<DO_SACCodes>();
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCodes>>("ServiceManagement/GetServiceClassesByGroupID?servicegroup=" + servicegroup);
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
        public async Task<ActionResult> GetServiceCodesByID(int ServiceClassID)
        {
            try
            {
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACCodes>("ServiceManagement/GetServiceClassByID?ServiceClassID=" + ServiceClassID);
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
        public async Task<ActionResult> AddOrUpdateServiceClass(DO_SACCodes obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceClass", obj);
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
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceClassIndex?serviceGroupId=" + serviceGroupId + "&serviceClassId=" + serviceClassId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
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
        //public async Task<ActionResult> DeleteServiceClass(int serviceClassId)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceClass?serviceClassId=" + serviceClassId);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
        //                return Json(new { Status = false, Message = serviceResponse.Data.Message });
        //            }

        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
        //            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:DeleteServiceClass:For serviceClassId {0}", serviceClassId);
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}
        #endregion
    }
}
