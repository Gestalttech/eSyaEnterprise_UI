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
        public IActionResult EFA_01_00()
        {
            return View();
        }

        //class MenuType
        //{
        //    public string ID { get; set; }
        //    public string Type { get; set; } // HD - > Header,CL -> Cost Center Class , CC -> Cost Center
        //    public bool Status { get; set; }
        //}

        public async Task<ActionResult> GetCostCenterMenuForTree()
        {
            try
            {
                //var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_CostCenterClass>>("ServiceManagement/GetServiceTypes");
                //var st_list = new List<DO_ServiceType>();
                //if (serviceResponse.Status)
                //{
                //    st_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                //}
                //else
                //{
                //    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetServiceClasses:GetServiceTypes");
                //}
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
                //List<MenuType> TypeList = new List<MenuType>();
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
                    //int i = 0;
                    foreach (var st in sg_list)
                    {
                        jsObj = new jsTreeObject();
                        jsObj.id = "CL" + st.CostCenterClass.ToString();
                        jsObj.parent = "HD0";
                        jsObj.text = st.CostClassDesc;
                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";

                        //jsObj.GroupIndex = i.ToString();
                        //i++;
                        jsObj.state = new stateObject { opened = false, selected = false };
                        treeView.Add(jsObj);
                        //TypeList.Add(new MenuType { ID = jsObj.id, Type = "CL", Status = st.Status });//CC -> Cost Center Class


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
                                    jsObj.text = sc.CostCenterDesc; //+ " - " + m.AccountCode;
                                                                    //obj.icon = "/Content/images/Finance/EditIcon.png";//AccountsIcon.png";
                                                                    //jsObj.GroupIndex = i.ToString(); i++;

                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.state = new stateObject { opened = false, selected = false };
                                    treeView.Add(jsObj);
                                    //TypeList.Add(new MenuType { ID = jsObj.id, Type = "CC", Status = sc.Status });


                                    //if (st.CostCenterClass == sc.CostCenterClass)
                                    //{
                                    //    if (sc.CostCenterCode == sc.ParentId)
                                    //    {
                                    //        jsObj = new jsTreeObject();
                                    //        jsObj.id = "C" + sc.ServiceClassId.ToString();
                                    //        jsObj.text = sc.ServiceClassDesc;
                                    //        jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    //        jsObj.parent = sg.ServiceGroupId.ToString();
                                    //        treeView.Add(jsObj);
                                    //    }
                                    //    else
                                    //    {
                                    //        jsObj = new jsTreeObject();
                                    //        jsObj.id = "C" + sc.ServiceClassId.ToString();
                                    //        jsObj.text = sc.ServiceClassDesc;
                                    //        jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    //        jsObj.parent = "C" + sc.ParentId.ToString();
                                    //        treeView.Add(jsObj);
                                    //    }

                                    //}
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

        public async Task<ActionResult> AddOrUpdateCostCenterClass(DO_CostCenterClass obj)
        {
            try
            {
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CostCentre/CreateCostCenterClass", obj);
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
        #endregion
    }
}
