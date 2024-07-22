using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.EndUser.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class UserCreationController : Controller
    {
        private readonly IeSyaEndUserAPIServices _eSyaEndUserAPIServices;
        private readonly ISmsServices _smsServices;
        private readonly ILogger<UserCreationController> _logger;

        public UserCreationController(IeSyaEndUserAPIServices eSyaEndUserAPIServices, ISmsServices smsServices, ILogger<UserCreationController> logger)
        {
            _eSyaEndUserAPIServices = eSyaEndUserAPIServices;
            _smsServices = smsServices;
            _logger = logger;
        }
        //#region New User Group&Type
        //[Area("EndUser")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        //public async Task<IActionResult> EEU_01_01()
        //{
        //    try
        //    {
        //        //ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsView = true, IsDelete = true };
        //        List<int> l_ac = new List<int>();
        //        l_ac.Add(ApplicationCodeTypeValues.UserGroup);
        //        l_ac.Add(ApplicationCodeTypeValues.UserType);
        //        l_ac.Add(ApplicationCodeTypeValues.UserRole);
        //        var response = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_ac);
        //        if (response.Status)
        //        {
        //            if (response.Data != null)
        //            {
        //                List<DO_ApplicationCodes> app_codes = response.Data;
        //                ViewBag.UGappcodes = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserGroup);
        //                ViewBag.UTappcodes = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserType);
        //                ViewBag.URappcodes = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserRole);
        //                return View();
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeTypeList");
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeTypeList");
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetApplicationCodesByCodeTypeList");
        //        throw ex;
        //    }
        //}

        /////// <summary>
        /////// Get Menu List for js tree
        /////// </summary>
        ////[Produces("application/json")]
        ////[HttpPost]
        ////public async Task<JsonResult> GetMenulistbyUserGroup(int UserGroup, int UserType, int UserRole)
        ////{
        ////    try
        ////    {
        ////        List<jsTreeObject> jsTree = new List<jsTreeObject>();

        ////        jsTreeObject jsObj = new jsTreeObject
        ////        {
        ////            id = "MM",
        ////            parent = "#",
        ////            text = "eSya Enterprise",
        ////            state = new stateObject { opened = true, selected = false }
        ////        };
        ////        jsTree.Add(jsObj);
        ////        var parameter = "?UserGroup=" + UserGroup + "&UserType=" + UserType + "&UserRole=" + UserRole;
        ////        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("UserCreation/GetMenulistbyUserGroup" + parameter);

        ////        if (serviceResponse.Status)
        ////        {
        ////            var configureMenu = serviceResponse.Data;

        ////            if (configureMenu != null)
        ////            {
        ////                //Add Main Menu
        ////                foreach (var m in configureMenu.l_MainMenu.OrderBy(o => o.MenuIndex))
        ////                {
        ////                    jsObj = new jsTreeObject
        ////                    {
        ////                        id = "MM" + m.MainMenuId.ToString(),
        ////                        text = m.MainMenu,
        ////                        GroupIndex = m.MenuIndex.ToString(),
        ////                        parent = "MM",
        ////                    };
        ////                    jsTree.Add(jsObj);
        ////                }

        ////                //Add Sub Menu
        ////                foreach (var s in configureMenu.l_SubMenu.OrderBy(o => o.MenuIndex))
        ////                {
        ////                    jsObj = new jsTreeObject
        ////                    {
        ////                        id = "SM" + s.MenuItemId.ToString(),
        ////                        text = s.MenuItemName,
        ////                        GroupIndex = s.MenuIndex.ToString(),
        ////                        parent = "MM" + s.MainMenuId.ToString()//s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
        ////                    };
        ////                    jsTree.Add(jsObj);
        ////                }

        ////                //Add Form
        ////                foreach (var f in configureMenu.l_FormMenu.OrderBy(o => o.FormIndex))
        ////                {
        ////                    if (f.ActiveStatus)
        ////                    {
        ////                        jsObj = new jsTreeObject
        ////                        {
        ////                            id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".1",
        ////                            text = f.FormNameClient,
        ////                            GroupIndex = f.FormIndex.ToString(),
        ////                            parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),

        ////                            icon = "/images/jsTree/checkedstate.jpg",
        ////                            state = new stateObject { opened = true, selected = false }
        ////                        };
        ////                        jsTree.Add(jsObj);
        ////                    }
        ////                    else
        ////                    {
        ////                        jsObj = new jsTreeObject
        ////                        {
        ////                            id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".0",
        ////                            text = f.FormNameClient,
        ////                            GroupIndex = f.FormIndex.ToString(),
        ////                            parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),
        ////                            state = new stateObject { opened = true, selected = false }
        ////                        };
        ////                        jsTree.Add(jsObj);
        ////                    }
        ////                }



        ////            }

        ////            return Json(jsTree);
        ////        }
        ////        else
        ////        {
        ////            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserRole {2} with  entered {3}", UserGroup, UserType, UserRole);
        ////            return Json(new { Status = false, StatusCode = "500" });
        ////        }
        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        _logger.LogError(ex, "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserRole {2} with  entered {3}", UserGroup, UserType, UserRole);
        ////        throw ex;
        ////    }
        ////}


        ///// <summary>
        ///// Get Menu List for js tree
        ///// </summary>
        //[Produces("application/json")]
        //[HttpPost]
        //public async Task<JsonResult> GetMenulistbyUserGroup(int UserGroup, int UserType, int UserRole)
        //{
        //    try
        //    {
        //        string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

        //        List<jsTreeObject> jsTree = new List<jsTreeObject>();

        //        jsTreeObject jsObj = new jsTreeObject
        //        {
        //            id = "MM",
        //            parent = "#",
        //            text = "eSya Enterprise",
        //            state = new stateObject { opened = true, selected = false }
        //        };
        //        jsTree.Add(jsObj);
        //        var parameter = "?UserGroup=" + UserGroup + "&UserType=" + UserType + "&UserRole=" + UserRole;
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("UserCreation/GetMenulistbyUserGroup" + parameter);

        //        if (serviceResponse.Status)
        //        {
        //            var configureMenu = serviceResponse.Data;

        //            if (configureMenu != null)
        //            {
        //                List<DO_SubMenu> l_menu = new List<DO_SubMenu>();
        //                //Add Main Menu
        //                foreach (var m in configureMenu.l_MainMenu.OrderBy(o => o.MenuIndex))
        //                {
        //                    jsObj = new jsTreeObject
        //                    {
        //                        id = "MM" + m.MainMenuId.ToString(),
        //                        text = m.MainMenu,
        //                        GroupIndex = m.MenuIndex.ToString(),
        //                        parent = "MM",
        //                    };
        //                    jsTree.Add(jsObj);

        //                    var sb = GetMenuFormItems(m.MainMenuId, 0, configureMenu.l_SubMenu, configureMenu.l_FormMenu);
        //                    l_menu.AddRange(sb);


        //                }


        //                //Add Sub Menu
        //                var menu = l_menu.OrderBy(o => o.MenuIndex);
        //                foreach (var s in menu)
        //                {
        //                    if (!s.IsForm)
        //                    {
        //                        jsObj = new jsTreeObject
        //                        {
        //                            id = "SM" + s.MenuItemId.ToString(),
        //                            text = s.MenuItemName,
        //                            GroupIndex = s.MenuIndex.ToString(),
        //                            parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
        //                        };
        //                        jsTree.Add(jsObj);

        //                    }
        //                    else
        //                    {

        //                        if (s.ActiveStatus)
        //                        {
        //                            jsObj = new jsTreeObject
        //                            {
        //                                //id = "FM" + s.ParentID.ToString() + "_" + s.FormId.ToString(),
        //                                id = "FM" + s.ParentID.ToString() + "." + s.FormId.ToString() + ".1",
        //                                text = s.MenuItemName,
        //                                GroupIndex = s.MenuIndex.ToString(),
        //                                parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString(),

        //                                icon = baseURL + "/images/jsTree/checkedstate.jpg",
        //                                state = new stateObject { opened = true, selected = false }
        //                            };
        //                            jsTree.Add(jsObj);
        //                        }
        //                        else
        //                        {
        //                            jsObj = new jsTreeObject
        //                            {
        //                                //id = "FM" + s.ParentID.ToString() + "_" + s.FormId.ToString(),
        //                                id = "FM" + s.ParentID.ToString() + "." + s.FormId.ToString() + ".1",
        //                                text = s.MenuItemName,
        //                                GroupIndex = s.MenuIndex.ToString(),
        //                                parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString(),
        //                                state = new stateObject { opened = true, selected = false }
        //                            };
        //                            jsTree.Add(jsObj);
        //                        }


        //                    }
        //                }


        //            }

        //            return Json(jsTree);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserRole {2} with  entered {3}", UserGroup, UserType, UserRole);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserRole {2} with  entered {3}", UserGroup, UserType, UserRole);
        //        throw ex;
        //    }
        //}

        ////public List<DO_SubMenu> GetMenuFormItems(int mainMenuID, int menuItemID, List<DO_SubMenu> l_SubMenu, List<DO_FormMenu> l_FormMenu)
        ////{
        ////    List<DO_SubMenu> l_menu = new List<DO_SubMenu>();
        ////    var sb2 = l_SubMenu.Where(w => w.MainMenuId == mainMenuID && w.ParentID == menuItemID).OrderBy(o => o.MenuIndex).ToList();
        ////    var fm2 = l_FormMenu.Where(w => w.MainMenuId == mainMenuID && w.MenuItemId == menuItemID).OrderBy(o => o.FormIndex);
        ////    foreach (var f in fm2)
        ////    {
        ////        DO_SubMenu o = new DO_SubMenu();
        ////        o.FormId = f.FormId;
        ////        o.MenuItemName = f.FormNameClient;
        ////        o.ActiveStatus = f.ActiveStatus;
        ////        o.MenuIndex = f.FormIndex;
        ////        o.ParentID = f.MenuItemId;
        ////        o.MenuItemId = f.MenuItemId;
        ////        o.MainMenuId = f.MainMenuId;
        ////        o.IsForm = true;
        ////        l_menu.Add(o);
        ////    }
        ////    l_menu.AddRange(sb2);

        ////    foreach (var s in sb2)
        ////        l_menu.AddRange(GetMenuFormItems(mainMenuID, s.MenuItemId, l_SubMenu, l_FormMenu));

        ////    return l_menu;
        ////}

        ///// <summary>
        /////Get User Group form Action Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetFormActionLinkbyUserGroup(int UserGroup, int UserType, int UserRole, int MenuKey)
        //{
        //    try
        //    {
        //        var parameter = "?UserGroup=" + UserGroup + "&UserType=" + UserType + "&UserRole=" + UserRole + "&MenuKey=" + MenuKey;

        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserFormAction>>("UserCreation/GetFormActionLinkbyUserGroup" + parameter);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormActionLinkbyUserGroup:For UserGroup {0} UserType {1} with UserRole {2}", UserGroup, UserType, UserRole);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormActionLinkbyUserGroup:For UserID {0} BusinessKey {1} with MenuKey {2}", UserGroup, UserType, UserRole);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetFormActionLinkbyUserGroup:For UserID {0} BusinessKey {1} with MenuKey {2}", UserGroup, UserType, UserRole);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Insert or Update User Group Menu Link and User Group Form Action Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> InsertIntoUserGroupMenuAction(DO_UserGroupRole obj)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(obj.UserGroup.ToString()) || obj.UserGroup == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select User Group" });
        //        }
        //        else if (string.IsNullOrEmpty(obj.UserType.ToString()) || obj.UserType == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select User Type" });
        //        }
        //        else if (string.IsNullOrEmpty(obj.UserRole.ToString()) || obj.UserRole == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select User Role" });
        //        }
        //        else if (string.IsNullOrEmpty(obj.MenuKey.ToString()) || obj.MenuKey == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Menu" });
        //        }
        //        else
        //        {
        //            obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //            obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
        //            obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

        //            var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserGroupMenuAction", obj);
        //            if (serviceResponse.Status)
        //                return Json(serviceResponse.Data);
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoUserGroupMenuAction:params:" + JsonConvert.SerializeObject(obj));
        //                return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:InsertIntoUserMenuAction:params:" + JsonConvert.SerializeObject(obj));
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}
        //#endregion New User Group&Type

        //#region New User Creation

        //[Area("EndUser")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        //public async Task<IActionResult> EEU_03_00()
        //{
        //    try
        //    {
        //        //ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsView = true, IsDelete = true };
        //        List<int> l_ac = new List<int>();
        //        l_ac.Add(ApplicationCodeTypeValues.UserGroup);
        //        l_ac.Add(ApplicationCodeTypeValues.UserType);

        //        var response = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_ac);

        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("CommonData/GetISDCodes");

        //        var docserviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_DoctorMaster>>("CommonData/GetDoctorsforCombo");

        //        ViewBag.UserAuthentication = 0;
        //        if (response.Status && serviceResponse.Status && docserviceResponse.Status)
        //        {
        //            if (response.Data != null && serviceResponse.Data != null)
        //            {
        //                List<DO_ApplicationCodes> app_codes = response.Data;

        //                ViewBag.UserGroupList = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserGroup).Select(b => new SelectListItem
        //                {
        //                    Value = b.ApplicationCode.ToString(),
        //                    Text = b.CodeDesc,
        //                }).ToList();

        //                ViewBag.UserTypeList = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserType).Select(b => new SelectListItem
        //                {
        //                    Value = b.ApplicationCode.ToString(),
        //                    Text = b.CodeDesc,
        //                }).ToList();

        //                ViewBag.ISDCodeList = serviceResponse.Data.Select(b => new SelectListItem
        //                {
        //                    Value = b.Isdcode.ToString(),
        //                    Text = b.Isdcode.ToString() + '-' + b.CountryName,
        //                }).ToList();

        //                ViewBag.Doctors = docserviceResponse.Data.Select(b => new SelectListItem
        //                {
        //                    Value = b.DoctorId.ToString(),
        //                    Text = b.DoctorName,
        //                }).ToList();
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(response.Message), "UD:UserMaster");
        //                // return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(response.Message), "UD:UserMaster");
        //            //return Json(new { Status = false, StatusCode = "500" });
        //        }
        //        return View();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:UserMaster");
        //        throw ex;
        //    }
        //}

        ///// <summary>
        /////Get User Master for Grid
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserMaster()
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetUserMaster");
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyNamebyIsdCode");
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyNamebyIsdCode");
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetCurrencyNamebyIsdCode");
        //        throw ex;
        //    }
        //}

        ///// <summary>
        /////Get User Master Details
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserDetails(int UserID)
        //{
        //    try
        //    {
        //        var parameter = "?UserID=" + UserID;
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_UserMaster>("UserCreation/GetUserDetails" + parameter);

        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                var data = serviceResponse.Data;

        //                string userimageURI = string.Empty;
        //                if (data.Photo.Length != 0)
        //                    userimageURI = ConvertByteArraytoImageURI(data.Photo);
        //                data.userimage = userimageURI;

        //                string DSimageURI = string.Empty;
        //                if (data.DigitalSignature.Length != 0)
        //                    DSimageURI = ConvertByteArraytoImageURI(data.DigitalSignature);
        //                data.DSimage = DSimageURI;

        //                return Json(data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserDetails:For UserID {0}", UserID);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserDetails:For UserID {0}", UserID);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserDetails:For UserID {0}", UserID);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        /////Get User Business Location for Grid
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserBusinessLocation(short UserID)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserBusinessLink>>("UserCreation/GetUserBusinessLocation?UserID=" + UserID + "&CodeTypeUG=" + ApplicationCodeTypeValues.UserGroup + "&CodeTypeUT=" + ApplicationCodeTypeValues.UserType);

        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserBusinessLocation:For UserID {0}", UserID);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserBusinessLocation:For UserID {0}", UserID);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserBusinessLocation:For UserID {0}", UserID);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Insert or Update User Master
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> InsertOrUpdateUserMaster(DO_UserMaster userMaster, string file, string DSfile)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(userMaster.LoginID))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Login ID" });
        //        }
        //        else if (string.IsNullOrEmpty(userMaster.LoginDesc))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Login Description" });
        //        }
        //        else if (string.IsNullOrEmpty(userMaster.Password))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Password" });
        //        }
        //        else if (string.IsNullOrEmpty(userMaster.ISDCode.ToString()) || userMaster.ISDCode == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select ISD" });
        //        }
        //        else if (string.IsNullOrEmpty(userMaster.MobileNumber))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Mobile No" });
        //        }
        //        else if (string.IsNullOrEmpty(userMaster.eMailID))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Email Id" });
        //        }
        //        else
        //        {
        //            userMaster.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //            userMaster.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
        //            userMaster.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
        //            if (file != null)
        //            {

        //                string userbase64 = file;// load base 64 code to this variable from js 
        //                Byte[] userbitmapData = new Byte[userbase64.Length];
        //                userbitmapData = Convert.FromBase64String(FixBase64ForImage(userbase64));
        //                if (userbitmapData.Length > 2 * 1024 * 1024)
        //                {
        //                    return Json(new DO_ReturnParameter() { Status = false, Message = "User Photo file size should be smaller than 2 MB" });
        //                }

        //                userMaster.Photo = userbitmapData;
        //            }
        //            else
        //            {
        //                byte[] emptyByte = { };
        //                userMaster.Photo = emptyByte;
        //            }
        //            if (DSfile != null)
        //            {

        //                string DSbase64 = DSfile;// load base 64 code to this variable from js 
        //                Byte[] DSbitmapData = new Byte[DSbase64.Length];
        //                DSbitmapData = Convert.FromBase64String(FixBase64ForImage(DSbase64));
        //                if (DSbitmapData.Length > 2 * 1024 * 1024)
        //                {
        //                    return Json(new DO_ReturnParameter() { Status = false, Message = "Digital Signature file size should be smaller than 2 MB" });
        //                }
        //                userMaster.DigitalSignature = DSbitmapData;
        //            }
        //            else
        //            {
        //                byte[] emptyByte = { };
        //                userMaster.DigitalSignature = emptyByte;
        //            }
        //            if (userMaster.Authenticated == 0)
        //            {
        //                if (userMaster.UserID == 0)
        //                {
        //                    var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserMaster", userMaster);
        //                    if (serviceResponse.Status)
        //                        return Json(serviceResponse.Data);
        //                    else
        //                    {
        //                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(userMaster));
        //                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //                    }
        //                }
        //                else
        //                {
        //                    var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserMaster", userMaster);
        //                    if (serviceResponse.Status)
        //                        return Json(serviceResponse.Data);
        //                    else
        //                    {
        //                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(userMaster));
        //                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserMasteronAuthentication", userMaster);
        //                if (serviceResponse.Status)
        //                {
        //                    DO_SmsParameter smsParams = new DO_SmsParameter();
        //                    smsParams.TEventID = SMSTriggerEventValues.OnSaveClicked;
        //                    smsParams.FormID = AppSessionVariables.GetSessionFormID(HttpContext);
        //                    smsParams.UserID = userMaster.UserID;
        //                    smsParams.IsUserPasswordInclude = true;

        //                    //_smsServices.SendSmsForForm(smsParams);
        //                    return Json(serviceResponse.Data);
        //                }
        //                else
        //                {
        //                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(userMaster));
        //                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(userMaster));
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //public static string FixBase64ForImage(string image)
        //{

        //    var regex = new Regex(@"data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)", RegexOptions.Compiled);
        //    var match = regex.Match(image);
        //    var mime = match.Groups["mime"].Value;
        //    var encoding = match.Groups["encoding"].Value;
        //    var data = match.Groups["data"].Value;
        //    return data;
        //}

        //public static string ConvertByteArraytoImageURI(Byte[] image)
        //{

        //    StringBuilder ImageURI = new StringBuilder();
        //    ImageURI.Append("data:");
        //    string image_data = Convert.ToBase64String(image);
        //    string mime = "image/jpeg";
        //    string encoding = "base64";
        //    ImageURI.Append(mime);
        //    ImageURI.Append(";");
        //    ImageURI.Append(encoding);
        //    ImageURI.Append(",");
        //    ImageURI.Append(image_data);
        //    return Convert.ToString(ImageURI);
        //}

        ///// <summary>
        ///// Insert or Update User Business Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> InsertOrUpdateUserBL(DO_UserBusinessLink UserBusinessLink)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(UserBusinessLink.UserID.ToString()) || UserBusinessLink.UserID == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Login Id" });
        //        }
        //        else if (string.IsNullOrEmpty(UserBusinessLink.BusinessKey.ToString()) || UserBusinessLink.BusinessKey == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Business Location" });
        //        }
        //        else
        //        {
        //            UserBusinessLink.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //            UserBusinessLink.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
        //            UserBusinessLink.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);

        //            if (UserBusinessLink.IUStatus == 0)
        //            {
        //                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserBL", UserBusinessLink);
        //                if (serviceResponse.Status)
        //                    return Json(serviceResponse.Data);
        //                else
        //                {
        //                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserBL:params:" + JsonConvert.SerializeObject(UserBusinessLink));
        //                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //                }
        //            }
        //            else
        //            {
        //                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserBL", UserBusinessLink);
        //                if (serviceResponse.Status)
        //                    return Json(serviceResponse.Data);
        //                else
        //                {
        //                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserBL:params:" + JsonConvert.SerializeObject(UserBusinessLink));
        //                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:InsertOrUpdateUserBL:params:" + JsonConvert.SerializeObject(UserBusinessLink));
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        ///// <summary>
        ///// Get Menu List for js tree
        ///// </summary>
        //[Produces("application/json")]
        //[HttpPost]
        //public async Task<JsonResult> GetMenulist(int UserGroup, int UserType, short UserID, int BusinessKey)
        //{
        //    try
        //    {
        //        List<jsTreeObject> jsTree = new List<jsTreeObject>();

        //        jsTreeObject jsObj = new jsTreeObject
        //        {
        //            id = "MM",
        //            parent = "#",
        //            text = "eSya Enterprise",
        //            state = new stateObject { opened = true, selected = false }
        //        };
        //        jsTree.Add(jsObj);
        //        var parameter = "?UserGroup=" + UserGroup + "&UserType=" + UserType + "&UserID=" + UserID + "&BusinessKey=" + BusinessKey;
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("UserCreation/GetMenulist" + parameter);

        //        if (serviceResponse.Status)
        //        {
        //            var configureMenu = serviceResponse.Data;

        //            if (configureMenu != null)
        //            {
        //                //Add Main Menu
        //                foreach (var m in configureMenu.l_MainMenu.OrderBy(o => o.MenuIndex))
        //                {
        //                    jsObj = new jsTreeObject
        //                    {
        //                        id = "MM" + m.MainMenuId.ToString(),
        //                        text = m.MainMenu,
        //                        GroupIndex = m.MenuIndex.ToString(),
        //                        parent = "MM",
        //                    };
        //                    jsTree.Add(jsObj);
        //                }

        //                //Add Sub Menu
        //                foreach (var s in configureMenu.l_SubMenu.OrderBy(o => o.MenuIndex))
        //                {
        //                    jsObj = new jsTreeObject
        //                    {
        //                        id = "SM" + s.MenuItemId.ToString(),
        //                        text = s.MenuItemName,
        //                        GroupIndex = s.MenuIndex.ToString(),
        //                        parent = "MM" + s.MainMenuId.ToString()//s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
        //                    };
        //                    jsTree.Add(jsObj);
        //                }

        //                //Add Form
        //                foreach (var f in configureMenu.l_FormMenu.OrderBy(o => o.FormIndex))
        //                {
        //                    if (f.ActiveStatus)
        //                    {
        //                        jsObj = new jsTreeObject
        //                        {
        //                            id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".1",
        //                            text = f.FormNameClient,
        //                            GroupIndex = f.FormIndex.ToString(),
        //                            parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),

        //                            icon = "/images/jsTree/checkedstate.jpg",
        //                            state = new stateObject { opened = true, selected = false }
        //                        };
        //                        jsTree.Add(jsObj);
        //                    }
        //                    else
        //                    {
        //                        jsObj = new jsTreeObject
        //                        {
        //                            id = "FM" + f.MenuItemId.ToString() + "." + f.FormId.ToString() + ".0",
        //                            text = f.FormNameClient,
        //                            GroupIndex = f.FormIndex.ToString(),
        //                            parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString(),
        //                            state = new stateObject { opened = true, selected = false }
        //                        };
        //                        jsTree.Add(jsObj);
        //                    }
        //                }
        //            }

        //            return Json(jsTree);
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserID {2} with BusinessKey entered {3}", UserGroup, UserType, UserID, BusinessKey);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserType {1} UserID {2} with BusinessKey entered {3}", UserGroup, UserType, UserID, BusinessKey);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        /////Get User form Action Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserFormActionLink(int UserID, int BusinessKey, int MenuKey)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserFormAction>>("UserCreation/GetUserFormActionLink?UserID=" + UserID + "&BusinessKey=" + BusinessKey + "&MenuKey=" + MenuKey);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserFormActionLink:For UserID {0} BusinessKey {1} with MenuKey {2}", UserID, BusinessKey, MenuKey);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserFormActionLink:For UserID {0} BusinessKey {1} with MenuKey {2}", UserID, BusinessKey, MenuKey);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserFormActionLink:For UserID {0} BusinessKey {1} with MenuKey {2}", UserID, BusinessKey, MenuKey);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Insert or Update User Menu Link and User Form Action Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> InsertIntoUserMenuAction(DO_UserMenuLink UserMenuLink)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(UserMenuLink.BusinessKey.ToString()) || UserMenuLink.BusinessKey == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Business Location" });
        //        }
        //        else if (string.IsNullOrEmpty(UserMenuLink.UserID.ToString()) || UserMenuLink.UserID == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Login Id" });
        //        }
        //        else if (string.IsNullOrEmpty(UserMenuLink.MenuKey.ToString()) || UserMenuLink.MenuKey == 0)
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Menu" });
        //        }
        //        else
        //        {
        //            UserMenuLink.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //            UserMenuLink.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
        //            UserMenuLink.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);

        //            var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserMenuAction", UserMenuLink);
        //            if (serviceResponse.Status)
        //                return Json(serviceResponse.Data);
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoUserMenuAction:params:" + JsonConvert.SerializeObject(UserMenuLink));
        //                return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:InsertIntoUserMenuAction:params:" + JsonConvert.SerializeObject(UserMenuLink));
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        ///// <summary>
        ///// Get User Menu keys for js tree
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetMenuKeysforUser(short UserID, int BusinessKey)
        //{
        //    try
        //    {
        //        var parameter = "?UserID=" + UserID + "&BusinessKey=" + BusinessKey;
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<int>>("UserCreation/GetMenuKeysforUser" + parameter);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMenuKeysforUser:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMenuKeysforUser:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetMenuKeysforUser:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //        throw ex;
        //        //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
        //    }
        //}

        ///// <summary>
        /////Get User Master for User Authentication Grid
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserMasterForUserAuthentication()
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetUserMasterForUserAuthentication");
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMasterForUserAuthentication");
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMasterForUserAuthentication");
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserMasterForUserAuthentication");
        //        throw ex;
        //    }
        //}

        ///// <summary>
        /////Get User Types by User Group for dropdown
        ///// </summary>
        //[HttpGet]
        //public async Task<JsonResult> GetUserTypesbyUserGroup(int usergroup)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserType>>("UserCreation/GetUserTypesbyUserGroup?usergroup=" + usergroup);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserTypesbyUserGroup:For usergroup {0} usergroup ", usergroup);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserTypesbyUserGroup:For usergroup {0} ", usergroup);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserTypesbyUserGroup:For usergroup {0} ", usergroup);
        //        throw ex;
        //    }
        //}

        //// <summary>
        /////Get User Roles by User Type for dropdown
        ///// </summary>
        //[HttpGet]
        //public async Task<JsonResult> GetUserRolesbyUserType(int usergroup, int usertype)
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserRole>>("UserCreation/GetUserRolesbyUserType?usergroup=" + usergroup + "&usertype=" + usertype);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserRolesbyUserType:For usergroup {0} usertype {1} ", usergroup, usertype);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserRolesbyUserType:For usergroup {0} usertype {1} ", usergroup, usertype);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserRolesbyUserGroup:For usergroup {0} usertype {1} ", usergroup, usertype);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Get User Role Menu Link based  on User ID and Busienss Key.
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserRoleMenuLinkbyUserId(short UserID, int BusinessKey)
        //{
        //    try
        //    {
        //        var parameter = "?UserID=" + UserID + "&BusinessKey=" + BusinessKey;
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserRoleMenuLink>>("UserCreation/GetUserRoleMenuLinkbyUserId" + parameter);
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserRoleMenuLinkbyUserId:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserRoleMenuLinkbyUserId:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserRoleMenuLinkbyUserId:For UserID {0} with BusinessKey entered {1}", UserID, BusinessKey);
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Insert or Update User Menu Link and User Form Action Link
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> InsertOrUpdateUserRoleMenuLink(bool isInsert, DO_UserRoleMenuLink obj)
        //{
        //    try
        //    {
        //        obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
        //        obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
        //        obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //        if (isInsert)
        //        {
        //            var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserRoleMenuLink", obj);
        //            if (serviceResponse.Status)
        //                return Json(serviceResponse.Data);
        //            else
        //                return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //        }

        //        else
        //        {
        //            var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserRoleMenuLink", obj);
        //            if (serviceResponse.Status)
        //                return Json(serviceResponse.Data);
        //            else
        //                return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:InsertOrUpdateUserRoleMenuLink:params:" + JsonConvert.SerializeObject(obj));
        //        return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
        //    }
        //}

        //#endregion User Creation

        //#region Active New user
        //[Area("EndUser")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        //public async Task<IActionResult> EEU_04_00()
        //{
        //    try
        //    {
        //        List<int> l_ac = new List<int>();
        //        l_ac.Add(ApplicationCodeTypeValues.UserGroup);
        //        l_ac.Add(ApplicationCodeTypeValues.UserType);

        //        var response = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_ac);

        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("CommonData/GetISDCodes");
        //        ViewBag.UserAuthentication = 1;
        //        if (response.Status && serviceResponse.Status)
        //        {
        //            if (response.Data != null && serviceResponse.Data != null)
        //            {
        //                List<DO_ApplicationCodes> app_codes = response.Data;

        //                ViewBag.UserGroupList = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserGroup).Select(b => new SelectListItem
        //                {
        //                    Value = b.ApplicationCode.ToString(),
        //                    Text = b.CodeDesc,
        //                }).ToList();

        //                ViewBag.UserTypeList = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserType).Select(b => new SelectListItem
        //                {
        //                    Value = b.ApplicationCode.ToString(),
        //                    Text = b.CodeDesc,
        //                }).ToList();

        //                ViewBag.ISDCodeList = serviceResponse.Data.Select(b => new SelectListItem
        //                {
        //                    Value = b.Isdcode.ToString(),
        //                    Text = b.Isdcode.ToString() + '-' + b.CountryName,
        //                }).ToList();

        //                // return View();
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(response.Message), "UD:UserMaster");
        //                // return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(response.Message), "UD:UserMaster");
        //            //return Json(new { Status = false, StatusCode = "500" });
        //        }
        //        return View();
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:UserMaster");
        //        throw ex;
        //    }
        //}

        //#endregion

        //#region User De-activation

        //[Area("EndUser")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        //public IActionResult EEU_05_00()
        //{
        //    return View();
        //}

        ///// <summary>
        /////Get User Master for User Deactivation Grid
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> GetUserMasterForUserDeactivation()
        //{
        //    try
        //    {
        //        var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetUserMasterForUserDeactivation");
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                return Json(serviceResponse.Data);
        //            }
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMasterForUserDeactivation");
        //                return Json(new { Status = false, StatusCode = "500" });
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMasterForUserDeactivation");
        //            return Json(new { Status = false, StatusCode = "500" });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:GetUserMasterForUserDeactivation");
        //        throw ex;
        //    }
        //}

        ///// <summary>
        ///// Update User Master for User Deativation Grid
        ///// </summary>
        //[HttpPost]
        //public async Task<JsonResult> UpdateUserForDeativation(DO_UserMaster userMaster)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(userMaster.LoginID))
        //        {
        //            return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Login ID" });
        //        }
        //        else
        //        {
        //            userMaster.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
        //            userMaster.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
        //            userMaster.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

        //            byte[] emptyByte = { };
        //            userMaster.Photo = emptyByte;
        //            userMaster.DigitalSignature = emptyByte;
        //            userMaster.MobileNumber = string.Empty;
        //            userMaster.Password = string.Empty;
        //            userMaster.eMailID = string.Empty;

        //            var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserForDeativation", userMaster);
        //            if (serviceResponse.Status)
        //                return Json(serviceResponse.Data);
        //            else
        //            {
        //                _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateUserForDeativation:params:" + JsonConvert.SerializeObject(userMaster));
        //                return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:UpdateUserForDeativation:params:" + JsonConvert.SerializeObject(userMaster));
        //        return Json(new { Status = false, Message = ex.ToString() });
        //    }
        //}

        //#endregion User De-activation

        #region User Creation New Process

        #region User Group

        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EEU_01_00()
        {
            try
            {
                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.UserGroup);
                l_ac.Add(ApplicationCodeTypeValues.UserRole);
                var response = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeTypeList", l_ac);
                var userroleresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("UserCreation/GetActiveUserRolesByCodeType?codeType=" + ApplicationCodeTypeValues.UserRole);
                var Businessresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");

                if (response.Status && Businessresponse.Status && userroleresponse.Status)
                {
                    if (response.Data != null)
                    {
                        List<DO_ApplicationCodes> app_codes = response.Data;
                        List<DO_ApplicationCodes> userrole = userroleresponse.Data;
                        ViewBag.UGappcodes = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserGroup);
                        //ViewBag.URappcodes = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.UserRole);
                        ViewBag.URappcodes = userrole;
                        ViewBag.Businesskeys = Businessresponse.Data;
                        return View();
                    }
                    else
                    {
                        _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeTypeList");
                        return View();
                    }
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeTypeList");
                    return View();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeTypeList");
                throw ex;
            }
        }
        string _MenuJSONFilePath = @"wwwroot\json\menuitem.json";
        /// <summary>
        /// Get Menu List for js tree
        /// </summary>
        [Produces("application/json")]
        [HttpPost]
        public async Task<JsonResult> GetUserRoleMenulist(int UserGroup, short UserRole, int BusinessKey)
        {
            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> jsTree = new List<jsTreeObject>();
                var eSyaMenuData = JsonStream.Read<MenuItem>(_MenuJSONFilePath);

                if (eSyaMenuData == null)
                    eSyaMenuData = new MenuItem() { MenuName = "eSya Menu" };

                jsTreeObject jsObj1 = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = eSyaMenuData.MenuName,
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false, checkbox_disabled = false }
                };
                jsTree.Add(jsObj1);

                var parameter = "?UserGroup=" + UserGroup + "&UserRole=" + UserRole + "&BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("UserCreation/GetUserRoleMenulist" + parameter);

                if (serviceResponse.Status)
                {
                    var configureMenu = serviceResponse.Data;

                    if (configureMenu != null)
                    {
                        List<DO_SubMenu> l_menu = new List<DO_SubMenu>();
                        //Add Main Menu
                        foreach (var m in configureMenu.l_MainMenu.OrderBy(o => o.MenuIndex))
                        {
                            jsTreeObject jsObj = new jsTreeObject
                            {
                                id = "MM" + m.MainMenuId.ToString(),
                                text = m.MainMenu,
                                icon = baseURL + "/images/jsTree/openfolder.png",
                                state = new stateObject { opened = false, selected = false, checkbox_disabled = false },
                                GroupIndex = m.MenuIndex.ToString(),
                                parent = "MM",
                            };
                            jsTree.Add(jsObj);

                            var sb = GetMenuFormItems(m.MainMenuId, 0, configureMenu.l_SubMenu, configureMenu.l_FormMenu);
                            l_menu.AddRange(sb);



                        }


                        //Add Sub Menu
                        //foreach (var s in configureMenu.l_SubMenu.OrderBy(o => o.MenuIndex))
                        var menu = l_menu.OrderBy(o => o.MenuIndex);
                        foreach (var s in menu)
                        {
                            if (!s.IsForm)
                            {
                                jsTreeObject jsObj = new jsTreeObject
                                {
                                    id = "SM" + s.MenuItemId.ToString(),
                                    text = s.MenuItemName,
                                    icon = baseURL + "/images/jsTree/openfolder.png",
                                    state = new stateObject { opened = false, selected = false, checkbox_disabled = false },
                                    GroupIndex = s.MenuIndex.ToString(),
                                    parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
                                };
                                jsTree.Add(jsObj);

                            }
                            else
                            {
                                jsTreeObject jsObj = new jsTreeObject
                                {
                                    id = "FM" + s.ParentID.ToString() + "_" + s.FormId.ToString(),
                                    text = s.MenuItemName,
                                    icon = baseURL + "/images/jsTree/fileIcon.png",
                                    state = new stateObject { opened = false, selected = s.ActiveStatus, checkbox_disabled = false },
                                    GroupIndex = s.MenuIndex.ToString(),
                                    parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
                                };
                                jsTree.Add(jsObj);
                            }
                        }



                    }

                    return Json(jsTree);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserRole {1} with BusinessKey entered {3}", UserGroup, UserRole, BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessSegmentforTreeView:For UserGroup {0} UserRole {1}  with BusinessKey entered {3}", UserGroup, UserRole, BusinessKey);
                throw ex;
            }
        }
        public List<DO_SubMenu> GetMenuFormItems(int mainMenuID, int menuItemID, List<DO_SubMenu> l_SubMenu, List<DO_FormMenu> l_FormMenu)
        {
            List<DO_SubMenu> l_menu = new List<DO_SubMenu>();
            var sb2 = l_SubMenu.Where(w => w.MainMenuId == mainMenuID && w.ParentID == menuItemID).OrderBy(o => o.MenuIndex).ToList();
            var fm2 = l_FormMenu.Where(w => w.MainMenuId == mainMenuID && w.MenuItemId == menuItemID).OrderBy(o => o.FormIndex);
            foreach (var f in fm2)
            {
                DO_SubMenu o = new DO_SubMenu();
                o.FormId = f.FormId;
                o.MenuItemName = f.FormNameClient;
                o.ActiveStatus = f.ActiveStatus;
                o.MenuIndex = f.FormIndex;
                o.ParentID = f.MenuItemId;
                o.MenuItemId = f.MenuItemId;
                o.MainMenuId = f.MainMenuId;
                o.IsForm = true;
                l_menu.Add(o);
            }
            l_menu.AddRange(sb2);

            foreach (var s in sb2)
                l_menu.AddRange(GetMenuFormItems(mainMenuID, s.MenuItemId, l_SubMenu, l_FormMenu));

            return l_menu;
        }

        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateUserRoleBusinessMenuLink(List<DO_UserGroupRole> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    return true;
                });


                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertOrUpdateUserRoleMenuLink", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateUserRoleMenuLink:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserRoleMenuLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserRoleMenuLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetActionsByUserGroup(int userRole)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserRoleActionLink>>("UserCreation/GetActionsByUserGroup?userRole=" + userRole);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActionsByUserGroup:For BusinessKey {0}", userRole);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActionsByUserGroup:For BusinessKey {0}", userRole);
                throw;
            }
        }
        #endregion

        #region Link Action to User Role  
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EEU_02_00()
        {
            try
            {
                ///Getting User Role
                var serviceresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.UserRole);

                if (serviceresponse.Status)
                {
                    if (serviceresponse.Data != null)
                    {
                        ViewBag.UserRole = serviceresponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.ApplicationCode.ToString(),
                            Text = b.CodeDesc.ToString(),
                        }).ToList();
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceresponse.Message), "UD:GetApplicationCodesByCodeType");
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetApplicationCodesByCodeType");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType");
                throw;
            }
        }
        /// <summary>
        /// Getting User Role Action Link by User Role
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetUserRoleActionLink(int userRole)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserRoleActionLink>>("UserCreation/GetUserRoleActionLink?userRole=" + userRole);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserRoleActionLink:For BusinessKey {0}", userRole);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserRoleActionLink:For BusinessKey {0}", userRole);
                throw;
            }
        }

        /// <summary>
        /// Insert Into User Role Action Link 
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUserRoleActionLink(List<DO_UserRoleActionLink> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertOrUpdateUserRoleActionLink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserRoleActionLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserRoleActionLink:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion

        #region New User Creation

        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EEU_03_00()
        {
            try
            {
                var eSyaAuthenticationresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("CommonData/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.eSyaAuthentication);
                var serviceresponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");

                if (serviceresponse.Status && eSyaAuthenticationresponse.Status)
                {
                    if (serviceresponse.Data != null && eSyaAuthenticationresponse.Data != null)
                    {
                        ViewBag.Businesskeys = serviceresponse.Data;
                        ViewBag.eSyaAuthenticationType = eSyaAuthenticationresponse.Data.OrderBy(x=>x.ApplicationCode).ToList();
                        return View();
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetBusinessKey");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                throw ex;
            }
        }

        #region Tab-1
        /// <summary>
        ///Get User Master for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUserMaster()
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetUserMaster");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMaster");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserMaster");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserMaster");
                throw ex;
            }
        }

        /// <summary>
        ///Get User Master Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUserDetails(int UserID)
        {
            try
            {
                var parameter = "?UserID=" + UserID;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_UserMaster>("UserCreation/GetUserDetails" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;

                        string userimageURI = string.Empty;
                        if (data.Photo.Length != 0)
                            userimageURI = ConvertByteArraytoImageURI(data.Photo);
                        data.userimage = userimageURI;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserDetails:For UserID {0}", UserID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserDetails:For UserID {0}", UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserDetails:For UserID {0}", UserID);
                throw ex;
            }
        }

        /// <summary>
        ///Get User Parameters for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUserParameters(int UserID)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("UserCreation/GetUserParameters?UserID="+ UserID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserParameters");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserParameters");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserParameters");
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update User Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUserMaster(DO_UserMaster obj, string file)
        {
            try
            {


                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                if (file != null)
                {

                    string userbase64 = file;// load base 64 code to this variable from js 
                    Byte[] userbitmapData = new Byte[userbase64.Length];
                    userbitmapData = Convert.FromBase64String(FixBase64ForImage(userbase64));
                    if (userbitmapData.Length > 2 * 1024 * 1024)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "User Photo file size should be smaller than 2 MB" });
                    }

                    obj.Photo = userbitmapData;
                }
                else
                {
                    byte[] emptyByte = { };
                    obj.Photo = emptyByte;
                }


                if (obj.UserID == 0)
                {
                    var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertIntoUserMaster", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/UpdateUserMaster", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserMaster:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        public static string FixBase64ForImage(string image)
        {

            var regex = new Regex(@"data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)", RegexOptions.Compiled);
            var match = regex.Match(image);
            var mime = match.Groups["mime"].Value;
            var encoding = match.Groups["encoding"].Value;
            var data = match.Groups["data"].Value;
            return data;
        }

        public static string ConvertByteArraytoImageURI(Byte[] image)
        {

            StringBuilder ImageURI = new StringBuilder();
            ImageURI.Append("data:");
            string image_data = Convert.ToBase64String(image);
            string mime = "image/jpeg";
            string encoding = "base64";
            ImageURI.Append(mime);
            ImageURI.Append(";");
            ImageURI.Append(encoding);
            ImageURI.Append(",");
            ImageURI.Append(image_data);
            return Convert.ToString(ImageURI);
        }
        #endregion

        #region Tab-2
        [HttpPost]
        public async Task<JsonResult> GetStateCodebyBusinessKey(int BusinessKey)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<int>("UserCreation/GetStateCodebyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStateCodebyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStateCodebyBusinessKey:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetPreferredLanguagebyBusinessKey(int BusinessKey)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_PreferredCulture>>("UserCreation/GetPreferredLanguagebyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPreferredLanguagebyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPreferredLanguagebyBusinessKey:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetUserBusinessLocationByUserID(int UserID)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserBusinessLocation>>("UserCreation/GetUserBusinessLocationByUserID?UserID=" + UserID);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserBusinessLocationByUserID:For UserID {0}", UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserBusinessLocationByUserID:For UserID {0}", UserID);
                throw;
            }
        }

        /// <summary>
        /// Insert Into Or Update User Business Location 
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUserBusinessLocation(DO_UserBusinessLocation obj)
        {
            try
            {

                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertOrUpdateUserBusinessLocation", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserBusinessLocation:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserBusinessLocation:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion

        #endregion User Creation

        #region Map User to User Group
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EEU_04_00()
        {
            try
            {
               

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_UserMaster>>("UserCreation/GetActiveUsers");
                if ( serviceResponse.Status)
                {
                    if ( serviceResponse.Data != null)
                    {


                        ViewBag.UserList = serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.UserID.ToString(),
                            Text = b.LoginDesc.ToString()
                        }).ToList();

                         return View();
                    }
                    
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveUsers");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveUsers");
                throw ex;
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMappedUserGroupByUserID(int UserID)
        {
            try
            {
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<List<DO_MapUsertoUserGroup>>("UserCreation/GetMappedUserGroupByUserID?UserID=" + UserID);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappedUserGroupByUserID:For UserID {0}", UserID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMappedUserGroupByUserID:For UserID {0}", UserID);
                throw;
            }
        }

        //for display menu in treeview


        [Produces("application/json")]
        [HttpPost]
        public async Task<JsonResult> GetMappedUserRoleMenulist(int UserGroup, short UserRole, int BusinessKey)
        {
            try
            {
                List<jsTreeObject> jsTree = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "MM",
                    parent = "#",
                    text = "eSya Enterprise",
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj);
                var parameter = "?UserGroup=" + UserGroup + "&UserRole=" + UserRole + "&BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("UserCreation/GetMappedUserRoleMenulist" + parameter);

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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappedUserRoleMenulist:For UserGroup {0} UserRole {1} BusinessKey {2} with BusinessKey entered {3}", UserGroup, UserRole, BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMappedUserRoleMenulist:For UserGroup {0} UserRole {1} BusinessKey {2} with BusinessKey entered {3}", UserGroup, UserRole, BusinessKey);
                throw ex;
            }
        }

        /// <summary>
        /// Insert Into User Mapped with User Group
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUserGroupMappedwithUser(DO_MapUsertoUserGroup obj)
        {
            try
            {
               
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/InsertOrUpdateUserGroupMappedwithUser", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateUserGroupMappedwithUser:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateUserGroupMappedwithUser:params:" + JsonConvert.SerializeObject(obj));
                throw;
            }
        }
        #endregion

        #endregion

        #region ChangePassword
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_10_00()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> ChangeUserPassword(DO_ChangePassword obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.userID = AppSessionVariables.GetSessionUserID(HttpContext);

                var serviceResponse = await _eSyaEndUserAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("UserCreation/ChangeUserPassword", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ChangeUserPassword:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ChangeUserPassword:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
