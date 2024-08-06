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
    public class SACCategoryController : Controller
    {
        private readonly IeSyaSACAPIServices _eSyaSACAPIServices;
        private readonly ILogger<SACCategoryController> _logger;
        public SACCategoryController(IeSyaSACAPIServices eSyaSACAPIServices, ILogger<SACCategoryController> logger)
        {
            _eSyaSACAPIServices = eSyaSACAPIServices;
            _logger = logger;
        }
        #region ServiceCategory

        /// <summary>
        /// Service Group
        /// </summary>
        /// <returns></returns>

        [Area("SAC")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_06_00()
        {
            return View();
        }

        public async Task<ActionResult> GetServiceGroups()
        {
            try
            {
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACClass>>("ServiceManagement/GetServiceTypes");
                var st_list = new List<DO_SACClass>();
                if (serviceResponse.Status)
                {
                    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceGroups:GetServiceTypes");
                }

                var serviceResponse1 = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCategory>>("ServiceManagement/GetServiceGroups");
                var sg_list = new List<DO_SACCategory>();
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
                        jsObj.id = st.Sacclass.ToString();
                        jsObj.text = st.SacclassDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.parent = "SG";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        if (sg_list != null)
                        {
                            foreach (var sg in sg_list)
                            {
                                if (st.Sacclass == sg.Sacclass)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = "G" + sg.Saccategory.ToString();
                                    jsObj.text = sg.SaccategoryDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.parent = st.Sacclass.ToString();
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
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<List<DO_SACCategory>>("ServiceManagement/GetServiceGroupsByTypeID?servicetype=" + servicetype);
                var sg_list = new List<DO_SACCategory>();
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
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_SACCategory>("ServiceManagement/GetServiceGroupByID?ServiceGroupID=" + ServiceGroupID);
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
        public async Task<ActionResult> AddOrUpdateServiceGroup(DO_SACCategory obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ServiceManagement/AddOrUpdateServiceGroup", obj);
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
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/UpdateServiceGroupIndex?serviceTypeId=" + serviceTypeId + "&serviceGroupId=" + serviceGroupId + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown);
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
                var serviceResponse = await _eSyaSACAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ServiceManagement/DeleteServiceGroup?serviceGroupId=" + serviceGroupId);
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
    }
}
