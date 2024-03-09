using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using eSyaEnterprise_UI.Utility;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class MenuController : Controller
    {

        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<MenuController> _logger;

        public MenuController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<MenuController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }

        #region Configure Menu

        #region Js Tree View

        string _MenuJSONFilePath = @"wwwroot\json\menuitem.json";


        /// <summary>
        /// Configure Menu
        /// </summary>
        /// <returns></returns>
        [Area("ProductSetup")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]

        public IActionResult EPS_05_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole
            {
                IsInsert = true,
                IsEdit = true,
                IsDelete = true,
                IsView = true
            };
            var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("Forms/GetFormDetails").Result;
            if (serviceResponse.Status)
            {
                var fm_list = serviceResponse.Data;
                ViewBag.FormList = fm_list;
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_2_00");
            }


            return View();
        }

        [Produces("application/json")]
        [HttpGet]
        public IActionResult GetConfigureMenuTreeView()
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
                    state = new stateObject { opened = true, selected = false }
                };
                jsTree.Add(jsObj1);

                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("eSyaConfigureMenu/GetConfigureMenuMaster").Result;
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
                                icon = m.ActiveStatus ? baseURL + "/images/jsTree/openfolder.png" : baseURL + "/images/jsTree/inactive.png",
                                GroupIndex = m.MenuIndex.ToString(),
                                parent = "MM",
                            };
                            jsTree.Add(jsObj);

                            var sb = GetMenuFormItems(m.MainMenuId, 0, configureMenu.l_SubMenu, configureMenu.l_FormMenu);
                            l_menu.AddRange(sb);

                            //var sb1 = configureMenu.l_SubMenu.Where(w => w.MainMenuId == m.MainMenuId && w.ParentID == 0).OrderBy(o => o.MenuIndex).ToList();
                            //var fm1 = configureMenu.l_FormMenu.Where(w => w.MainMenuId == m.MainMenuId && w.MenuItemId == 0).OrderBy(o => o.FormIndex);
                            //foreach (var f in fm1)
                            //{
                            //    DO_SubMenu o = new DO_SubMenu();
                            //    o.FormId = f.FormId;
                            //    o.MenuItemName = f.FormNameClient;
                            //    o.ActiveStatus = f.ActiveStatus;
                            //    o.MenuIndex = f.FormIndex;
                            //    o.ParentID = 0;
                            //    o.MenuItemId = f.MenuItemId;
                            //    o.MainMenuId = f.MainMenuId;
                            //    o.IsForm = true;
                            //    sb1.Add(o);
                            //}
                            //l_menu.AddRange(sb1);

                            //foreach(var s in sb1)
                            //{
                            //    var sb2 = configureMenu.l_SubMenu.Where(w => w.MainMenuId == m.MainMenuId && w.ParentID != 0  && w.ParentID == s.MenuItemId).OrderBy(o => o.MenuIndex).ToList();
                            //    var fm2 = configureMenu.l_FormMenu.Where(w => w.MainMenuId == m.MainMenuId && w.MenuItemId != 0 && w.MenuItemId == s.MenuItemId).OrderBy(o => o.FormIndex);
                            //    foreach (var f in fm2)
                            //    {
                            //        DO_SubMenu o = new DO_SubMenu();
                            //        o.FormId = f.FormId;
                            //        o.MenuItemName = f.FormNameClient;
                            //        o.ActiveStatus = f.ActiveStatus;
                            //        o.MenuIndex = f.FormIndex;
                            //        o.ParentID = f.MenuItemId;
                            //        o.MenuItemId = f.MenuItemId;
                            //        o.MainMenuId = f.MainMenuId;
                            //        o.IsForm = true;
                            //        sb2.Add(o);
                            //    }
                            //    l_menu.AddRange(sb2);
                            //}


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
                                    //icon = "/images/jsTree/openfolder.png",
                                    icon = s.ActiveStatus ? baseURL + "/images/jsTree/openfolder.png" : baseURL + "/images/jsTree/inactive.png",
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
                                    //icon = "/images/jsTree/fileIcon.png",
                                    icon = s.ActiveStatus ? baseURL + "/images/jsTree/fileIcon.png" : baseURL + "/images/jsTree/inactive.png",
                                    GroupIndex = s.MenuIndex.ToString(),
                                    //parent = "MM" + s.MainMenuId.ToString()
                                    parent = s.ParentID == 0 ? "MM" + s.MainMenuId.ToString() : "SM" + s.ParentID.ToString()
                                };
                                jsTree.Add(jsObj);
                            }
                        }

                        //Add Form
                        //foreach (var f in configureMenu.l_FormMenu.Where(w => w.MenuItemId != 0).OrderBy(o => o.FormIndex))
                        //{
                        //    jsObj = new jsTreeObject
                        //    {
                        //        id = "FM" + f.MenuItemId.ToString() + "_" + f.FormId.ToString(),
                        //        text = f.FormNameClient,
                        //        //icon = "/images/jsTree/fileIcon.png",
                        //        icon = f.ActiveStatus ? "/images/jsTree/fileIcon.png" : "/images/jsTree/inactive.png",
                        //        GroupIndex = f.FormIndex.ToString(),
                        //        parent = f.MenuItemId == 0 ? "MM" + f.MainMenuId.ToString() : "SM" + f.MenuItemId.ToString()
                        //    };
                        //    jsTree.Add(jsObj);
                        //}

                    }

                    return Json(jsTree);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetConfigureMenuTreeView");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetConfigureMenuTreeView");
                throw;
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

        public JsonResult GeteSyaMenuItem()
        {
            try
            {
                var eSyaMenuData = JsonStream.Read<MenuItem>(_MenuJSONFilePath);
                return Json(eSyaMenuData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GeteSyaMenuItem");
                throw;
            }
        }


        public JsonResult UpdateeSyaMenuItem(MenuItem obj)
        {
            try
            {
                JsonStream.Write<MenuItem>(obj, _MenuJSONFilePath);
                return Json(new DO_ReturnParameter() { Status = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateeSyaMenuItem:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false });
            }
        }
        #endregion

        #region MainMenu

        public JsonResult GetMainMenuByID(int mainMenuId)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_MainMenu>("eSyaConfigureMenu/GetMainMenuById?mainMenuId=" + mainMenuId).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMainMenuByID:params:" + JsonConvert.SerializeObject(new { mainMenuId }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMainMenuByID:Params:" + JsonConvert.SerializeObject(new { mainMenuId }));
                throw ex;
            }
        }

        [HttpPost]
        public JsonResult InsertIntoMainMenu(DO_MainMenu obj)
        {
            try
            {
                obj.UserId = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSyaConfigureMenu/InsertIntoMainMenu", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoMainMenu:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoMainMenu:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateMainMenuIndex(int mainMenuID, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/UpdateMainMenuIndex?mainMenuId=" + mainMenuID + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateMainMenuIndex:params:" + JsonConvert.SerializeObject(new { mainMenuID, isMoveUp, isMoveDown }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateMainMenuIndex:params:" + JsonConvert.SerializeObject(new { mainMenuID, isMoveUp, isMoveDown }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteMainMenuByID(int mainMenuID)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/DeleteMainMenuByID?mainMenuId=" + mainMenuID).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteMainMenuByID:params:" + JsonConvert.SerializeObject(new { mainMenuID }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteMainMenuByID:params:" + JsonConvert.SerializeObject(new { mainMenuID }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion MainMenu

        #region SubMenu
        public JsonResult GetSubMenuById(int menuItemID)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_SubMenu>("eSyaConfigureMenu/GetSubMenuById?menuItemId=" + menuItemID).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSubMenuById:params:" + JsonConvert.SerializeObject(new { menuItemID }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSubMenuById:params:" + JsonConvert.SerializeObject(new { menuItemID }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult InsertIntoSubMenu(DO_SubMenu obj)
        {
            try
            {
                obj.FormName = string.IsNullOrEmpty(obj.FormName) ? string.Empty : obj.FormName;
                obj.UserId = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSyaConfigureMenu/InsertIntoSubMenu", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoSubMenu:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoSubMenu:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateSubMenusIndex(int menuItemID, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/UpdateSubMenusIndex?menuItemId=" + menuItemID + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateSubMenusIndex:params:" + JsonConvert.SerializeObject(new { menuItemID, isMoveUp, isMoveDown }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateSubMenusIndex:params:" + JsonConvert.SerializeObject(new { menuItemID, isMoveUp, isMoveDown }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteSubMenuByID(int menuItemID)
        {
            try
            {

                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/DeleteSubMenuByID?menuItemID=" + menuItemID).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteSubMenuByID:params:" + JsonConvert.SerializeObject(new { menuItemID }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSubMenuByID:params:" + JsonConvert.SerializeObject(new { menuItemID }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion SubMenu

        #region Forms
        public JsonResult GetFormDetailsByID(int mainMenuID, int menuItemID, int formID)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_FormMenu>("eSyaConfigureMenu/GetFormDetailById?mainMenuID=" + mainMenuID + "&menuItemId=" + menuItemID + "&formId=" + formID).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormDetailsByID:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormDetailsByID:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult InsertIntoFormMenu(DO_FormMenu obj)
        {
            try
            {
                obj.FormInternalID = string.IsNullOrEmpty(obj.FormInternalID) ? string.Empty : obj.FormInternalID;
                obj.NavigateUrl = string.IsNullOrEmpty(obj.NavigateUrl) ? string.Empty : obj.NavigateUrl;
                obj.Area = string.IsNullOrEmpty(obj.Area) ? string.Empty : obj.Area;
                obj.Controller = string.IsNullOrEmpty(obj.Controller) ? string.Empty : obj.Controller;
                obj.View = string.IsNullOrEmpty(obj.View) ? string.Empty : obj.View;

                obj.UserId = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("eSyaConfigureMenu/InsertIntoFormMenu", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoFormMenu:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoFormMenu:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult UpdateFormsIndex(int mainMenuID, int menuItemID, int formID, bool isMoveUp, bool isMoveDown)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/UpdateFormsIndex?mainMenuID=" + mainMenuID + "&menuItemId=" + menuItemID + "&formId=" + formID + "&isMoveUp=" + isMoveUp + "&isMoveDown=" + isMoveDown).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateFormsIndex:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID, isMoveUp, isMoveDown }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateFormsIndex:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID, isMoveUp, isMoveDown }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteFormMenuByID(int mainMenuID, int menuItemID, int formID)
        {
            try
            {
                var serviceResponse = _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("eSyaConfigureMenu/DeleteFormMenuByID?mainMenuID=" + mainMenuID + "&menuItemID=" + menuItemID + "&formID=" + formID).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteFormMenuByID:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID }));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteFormMenuByID:params:" + JsonConvert.SerializeObject(new { mainMenuID, menuItemID, formID }));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion Forms

     #endregion Configure Menu
    }
}
