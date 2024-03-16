using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Data;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Controllers
{
    public class LocationMenuController : Controller
    {
        private readonly IeSyaConfigBusinessAPIServices _eSyaConfigBusinessAPIServices;
        private readonly ILogger<LocationMenuController> _logger;


        public LocationMenuController(IeSyaConfigBusinessAPIServices eSyaConfigBusinessAPIServices, ILogger<LocationMenuController> logger)
        {
            _eSyaConfigBusinessAPIServices = eSyaConfigBusinessAPIServices;
            _logger = logger;
        }

        #region Location Wise Menu
        [Area("ConfigBusiness")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECB_03_00()
        {
            var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
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

        string _MenuJSONFilePath = @"wwwroot\json\menuitem.json";

        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetLocationMenuLinkbyBusinessKey(int businesskey)
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

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_ConfigureMenu>("License/GetLocationMenuLinkbyBusinessKey?businesskey=" + businesskey);

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
        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateLocationMenuLink(List<DO_LocationMenuLink> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    return true;
                });


                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdateLocationMenuLink", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateLocationMenuLink:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateLocationMenuLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateLocationMenuLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
