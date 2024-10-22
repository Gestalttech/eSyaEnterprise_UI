using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigureEmail.Data;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Services;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class AuthorizeController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly IeSyaGatewayServices _eSyaGatewayServices;
        private readonly ILogger<AuthorizeController> _logger;
        private readonly ISmsServices _smsServices;
        private readonly IApplicationRulesServices _applicationRulesServices;
        private readonly IeSyaEmailAPIServices _eSyaEmailAPIServices;
        public AuthorizeController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, IeSyaGatewayServices eSyaGatewayServices, ILogger<AuthorizeController> logger, ISmsServices smsServices,
            IeSyaEmailAPIServices eSyaEmailAPIServices, IApplicationRulesServices applicationRulesServices)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;
            _eSyaGatewayServices = eSyaGatewayServices;
            _smsServices = smsServices;
            _logger = logger;
            _applicationRulesServices = applicationRulesServices;
            _eSyaEmailAPIServices = eSyaEmailAPIServices;
        }
        #region Authenticate a new user
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_05_00()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetUnAuthenticatedUsers(string authenticate)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("Authorize/GetUnAuthenticatedUsers?authenticate="+ authenticate);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUnAuthenticatedUsers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUnAuthenticatedUsers");
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> AuthenticateUser(DO_Authorize obj)
        {
            try
            {
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ModifiedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.IsUserAuthenticated = true;

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Authorize/AuthenticateUser", obj);

                if (serviceResponse.Status)
                {
                    int BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
                        BusinessKey = (BusinessKey == 0) ? 11 : BusinessKey;

                    int businesskey = BusinessKey; 
                    var smspr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 8, 1);
                    var emailpr = await _applicationRulesServices.GetBusinessApplicationRuleByBusinessKey(businesskey, 8, 2);
                    if (smspr)
                    {
                        DO_SmsParameter smsParams = new DO_SmsParameter
                        {
                            BusinessKey = BusinessKey,
                            TEventID = SMSTriggerEventValues.OnSaveClick,
                            FormID = AppSessionVariables.GetSessionFormID(HttpContext),
                            UserID = obj.UserID,
                        };

                        var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendeSysSms", smsParams).Result;
                        if (sr_SMS.Status)
                        {
                            return Json(new { Status = true,Message= "Email has sent sucessfully to User" });
                        }
                        else 
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:Send Welcome Message to UserId {0}", obj.UserID);
                            return Json(new { Status = false, StatusCode = "500" });
                        }

                    }
                    //need to implement after Email configured
                    else if(emailpr)
                    {
                        DO_EmailParameter emailParams = new DO_EmailParameter
                        {
                            BusinessKey = BusinessKey,
                            TEventID = SMSTriggerEventValues.OnSaveClick,
                            FormID = AppSessionVariables.GetSessionFormID(HttpContext),
                            UserID = obj.UserID,
                            EmailType = ApplicationCodesVariables.EmailType_ApplicationUser,
                        };

                        var sr_SMS = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_EmailParameter>("EmailSender/SendeSysEmail", emailParams).Result;
                        if (sr_SMS.Status)
                        {
                            return Json(new { Status = true, serviceResponse.Data });
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:Send Welcome Message to UserId {0}", obj.UserID);
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        return Json(new { Status = false, Message="No mediumn Activated to send message to this location" });
                    }
                   

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> RejectUser(DO_Authorize obj)
        {
            try
            {
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.ModifiedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.IsUserAuthenticated = false;

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Authorize/RejectUser", obj);

                if (serviceResponse.Status)
                {
                    //DO_SmsParameter smsParams = new DO_SmsParameter
                    //{
                    //    BusinessKey = 11,//AppSessionVariables.GetSessionBusinessKey(HttpContext),
                    //    TEventID = SMSTriggerEventValues.OnSaveClick,
                    //    FormID = AppSessionVariables.GetSessionFormID(HttpContext),
                    //    UserID = obj.UserID,
                    //};

                    //var sr_SMS = _eSyaGatewayServices.HttpClientServices.PostAsJsonAsync<DO_SmsParameter>("SmsSender/SendeSysSms", smsParams).Result;
                    //if (sr_SMS.Status)
                    //{
                    //    return Json(new { Status = true, serviceResponse.Data.StatusCode });
                    //}
                    //else
                    //{
                    //    _logger.LogError(new Exception(serviceResponse.Message), "UD:Send Welcome Message to UserId {0}", obj.UserID);
                    //    return Json(new { Status = false, StatusCode = "500" });
                    //}

                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AuthenticateUser:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }

        //for display menu in treeview


        [Produces("application/json")]
        [HttpPost]
        public async Task<JsonResult> GetUserLinkedFormMenulist(int UserID, int UserGroup, int UserRole)
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "eSya Enterprise Menu",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?UserID=" + UserID + "&UserGroup=" + UserGroup + "&UserRole=" + UserRole;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("Authorize/GetUserLinkedFormMenulist" + parameter);

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
                                    id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".1",
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
                                    id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".0",
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserLinkedFormMenulist:For UserGroup {0} UserRole {1} UserID {2} with UserID entered {3}", UserGroup, UserRole, UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserLinkedFormMenulist:For UserGroup {0} UserRole {1} UserID {2} with UserID entered {3}", UserGroup, UserRole, UserID);
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetActionListByUserRole(int userID, int UserGroup, int UserRole, int formID)
        {
            try
            {
                var parameter = "?userID=" + userID + "&UserGroup=" + UserGroup + "&UserRole=" + UserRole + "&formID=" + formID;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserRoleActionLink>>("Authorize/GetActionListByUserRole" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActionListByUserRole");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActionListByUserRole");
                throw;
            }
        }
        #endregion
    }
}
