using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.FinAdmin.Data;
using eSyaEnterprise_UI.Areas.FinAdmin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Irony;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Drawing.Drawing2D;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    [SessionTimeout]
    public class CostCenterController : Controller
    {
        private readonly IeSyaFinAdminAPIServices _eSyaFinAdminAPIServices;
        private readonly ILogger<CostCenterController> _logger;
        public CostCenterController(IeSyaFinAdminAPIServices eSyaFinAdminAPIServices, ILogger<CostCenterController> logger)
        {
            _eSyaFinAdminAPIServices = eSyaFinAdminAPIServices;
            _logger = logger;
        }

        #region Manage Cost Center
        [Area("FinAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EFA_01_00()
        {
            return View();
        }

        public async Task<ActionResult> GetCostCenterMenuForTree()
        {
            try
            {
                var serviceResponse1 = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CostCenterClass>>("CostCentre/GetCostCenterClass");
                var sg_list = new List<DO_CostCenterClass>();
                if (serviceResponse1.Status)
                {
                    sg_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetCostCenterList:GetCostCenterClass");
                }
                var sc_list = new List<DO_CostCenter>();
                var serviceResponse2 = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CostCenter>>("CostCentre/GetCostCenterList");
                if (serviceResponse2.Status)
                {
                    sc_list = serviceResponse2.Data;
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse2.Message), "UD:GetCostCenterList:GetCostCenterList");
                }
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsObj.id = "HD0";
                jsObj.parent = "#";
                jsObj.text = "Cost Center Master";
                jsObj.icon = "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                if (sg_list != null)
                {
                    foreach (var st in sg_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = "CL" + st.CostCenterClass.ToString();
                        jsObj.parent = "HD0";
                        jsObj.text = st.CostClassDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        
                        if (sc_list != null)
                        {
                            foreach (var sc in sc_list)
                            {
                                if (st.CostCenterClass == sc.CostCenterClass)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = "CC" + sc.CostCenterCode.ToString();
                                    if (sc_list.Select(x => x).Where(y => y.CostCenterClass == sc.CostCenterClass).Count() > 0)
                                        jsObj.parent = "CL" + sc.CostCenterClass.ToString();
                                    else
                                        continue;
                                    jsObj.text = sc.CostCenterDesc; 
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.state = new stateObject { opened = false, selected = false };
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
                _logger.LogError(ex, "UD:GetCostCenterMenuForTree");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> GetCostCenterClassByCode(int CostCenterClass)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CostCenterClass>>("CostCentre/GetCostCenterClassByCode?CostCenterClass=" + CostCenterClass);
                if (serviceResponse.Data != null)
                {
                    var data = serviceResponse.Data;
                    return Json(data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCostCenterClassByCode:For CostCenterClass {0}", CostCenterClass);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetServiceClassesByGroupID: CostCenterClass{0}", CostCenterClass);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> GetCostCenterCodes(int CostCentreCode)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CostCenter>>("CostCentre/GetCostCenterCodes?CostCentreCode=" + CostCentreCode);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCostCenterCodes:For CostCentreCode {0}", CostCentreCode);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCostCenterCodes: CostCentreCode{0}", CostCentreCode);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCostCenterCodes: CostCentreCode{0}", CostCentreCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> AddOrUpdateCostCenterClass(DO_CostCenterClass obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CostCentre/AddOrUpdateCostCenterClass", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateCostCenterClass:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateCostCenterClass:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateCostCenterClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> AddOrUpdateCostCenterCodes(DO_CostCenter obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CostCentre/AddOrUpdateCostCenterCodes", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateCostCenterCodes:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateCostCenterCodes:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateCostCenterCodes:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<ActionResult> DeleteCostCenterClass(int CostCenterClass)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("CostCentre/DeleteCostCenterClass?CostCenterClass=" + CostCenterClass);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteCostCenterClass:For CostCenterClass {0}", CostCenterClass);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteCostCenterClass: CostCenterClass{0}", CostCenterClass);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteCostCenterClass: CostCenterClass{0}", CostCenterClass);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<ActionResult> DeleteCostCenter(int CostCenterCode)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("CostCentre/DeleteCostCenter?CostCenterCode=" + CostCenterCode);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteCostCenterClass:For CostCenterClass {0}", CostCenterCode);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteCostCenterClass: CostCenterClass{0}", CostCenterCode);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteCostCenterClass: CostCenterClass{0}", CostCenterCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
