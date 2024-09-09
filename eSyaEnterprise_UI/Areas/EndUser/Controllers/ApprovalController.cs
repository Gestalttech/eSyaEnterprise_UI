using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class ApprovalController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ILogger<ApprovalController> _logger;
        public ApprovalController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ILogger<ApprovalController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;
            _logger = logger;
        }
        #region Map User to Approvals
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EEU_12_00()
        {
            var serviceresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceresponse.Status )
            {
                if (serviceresponse.Data != null)
                {
                    ViewBag.Businesskeys = serviceresponse.Data;
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                    return View();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                return View();
            }
           
        }

        [HttpPost]
        public async Task<JsonResult> GetApproverUserListbyBusinessKey(int BusinessKey)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("Approval/GetApproverUserListbyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappedUserGroupByUserID:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApproverUserListbyBusinessKey:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }

        //for display menu in treeview


        [Produces("application/json")]
        [HttpPost]
        public async Task<JsonResult> GetApprovalRequiredFormMenulist(int BusinessKey, int UserID)
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "Approval Forms",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?BusinessKey=" + BusinessKey + "&UserID=" + UserID;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("Approval/GetApprovalRequiredFormMenulist" + parameter);

                if (serviceResponse.Status)
                {
                    var configureMenu = serviceResponse.Data;

                    if (configureMenu != null)
                    {
                        //Add Main Menu
                        foreach (var m in configureMenu.l_MainMenu.OrderBy(o => o.MenuIndex))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "MM" + m.MainMenuId.ToString(),
                                text = m.MainMenu,
                                GroupIndex = m.MenuIndex.ToString(),
                                parent = "MM",
                            };
                            jsTree.Add(jsObj);
                        }

                        //Add Sub Menu
                        foreach (var s in configureMenu.l_SubMenu.OrderBy(o => o.MenuIndex))
                        {
                            jsObj = new jsTreeObject
                            {
                                id = "SM" + s.MenuItemId.ToString(),
                                text = s.MenuItemName,
                                GroupIndex = s.MenuIndex.ToString(),
                                parent = "MM" + s.MainMenuId.ToString()//s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
                            };
                            jsTree.Add(jsObj);
                        }

                        //Add Form
                        foreach (var f in configureMenu.l_FormMenu.OrderBy(o => o.FormIndex))
                        {
                            if (f.ActiveStatus)
                            {
                                jsObj = new jsTreeObject
                                {
                                    //id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".1",
                                    id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString(),

                                    text = f.FormNameClient,
                                    GroupIndex = f.FormIndex.ToString(),
                                    parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),

                                    icon = "/images/jsTree/checkedstate.jpg",
                                    state = new stateObject { opened = true, selected = false }
                                };
                                jsTree.Add(jsObj);
                            }
                            else
                            {
                                jsObj = new jsTreeObject
                                {
                                    //id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".0",
                                    id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString(),
                                    text = f.FormNameClient,
                                    GroupIndex = f.FormIndex.ToString(),
                                    parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApprovalRequiredFormMenulist:For BusinessKey {0} UserID {1} ", BusinessKey, UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApprovalRequiredFormMenulist:For BusinessKey {0} UserID {1}", BusinessKey, UserID);
                throw ex;
            }


        }
        [HttpPost]
        public async Task<JsonResult> GetApprovalLevelsbyFormID(int businesskey, int formId)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_ApprovalLevels>>("Approval/GetApprovalLevelsbyFormID?businesskey=" + businesskey+ "&formId="+ formId);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApprovalLevelsbyFormID:For formId {0}", formId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApprovalLevelsbyFormID:For formId {0}", formId);
                throw;
            }
        }

        #endregion
    }
}
