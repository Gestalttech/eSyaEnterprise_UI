using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigInventory.Data;
using eSyaEnterprise_UI.Areas.ConfigInventory.Models;
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
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigInventory.Controllers
{
    [SessionTimeout]
    public class GroupingController : Controller
    {
        private readonly IeSyaConfigInventoryAPIServices _eSyaConfigInventoryAPIServices;
        private readonly ILogger<GroupingController> _logger;

        public GroupingController(IeSyaConfigInventoryAPIServices eSyaConfigInventoryAPIServices, ILogger<GroupingController> logger)
        {
            _eSyaConfigInventoryAPIServices = eSyaConfigInventoryAPIServices;
            _logger = logger;
        }

        #region ItemGroup
        /// <summary>
        /// Item Group
        /// </summary>
        /// <returns></returns>

        [Area("ConfigInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_04_00()
        {
            return View();
        }

        [Produces("application/json")]
        [HttpGet]
        public async Task<ActionResult> GetItemGroup()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "IG";
                jsObj.parent = "#";
                jsObj.text = "Item Groups";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemGroup>>("ItemControl/GetItemGroup");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ig_list = serviceResponse.Data;
                        foreach (var ig in ig_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = ig.ItemGroupId.ToString();
                            jsObj.text = ig.ItemGroupDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "IG";
                            treeView.Add(jsObj);
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemGroup");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemGroup");
                throw ex;
            }
        }
        public async Task<ActionResult> GetItemGroupByID(int ItemGroupID)
        {
            try
            {
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<DO_ItemGroup>("ItemControl/GetItemGroupByID?ItemGroupID=" + ItemGroupID);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemGroupByID:For ItemGroupID {0}", ItemGroupID);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemGroupByID:For ItemGroupID {0}", ItemGroupID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemGroupByID:For ItemGroupID {0}", ItemGroupID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateItemGroup(DO_ItemGroup obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemControl/AddOrUpdateItemGroup", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateItemGroup:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });

                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateItemGroup:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateItemGroup:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message.ToString() });
            }
        }
        #endregion

        #region ItemCategory
        /// <summary>
        /// Item Category
        /// </summary>
        /// <returns></returns>
        [Area("ConfigInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_05_00()
        {
            return View();
        }
        public async Task<ActionResult> LoadItemCategoryTree()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "IC";
                jsObj.parent = "#";
                jsObj.text = "Item Categories";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("ItemControl/GetItemCategory");

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ic_list = serviceResponse.Data;
                        foreach (var ic in ic_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = ic.ItemCategory.ToString();
                            jsObj.text = ic.ItemCategoryDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "IC";
                            jsObj.state = new stateObject { opened = false, selected = false };
                            treeView.Add(jsObj);
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:LoadItemCategoryTree");
                    }
                }


                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:LoadItemCategoryTree");
                throw ex;
            }


        }
        public async Task<ActionResult> GetItemCategoryByID(int ItemCategory)
        {
            try
            {
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<DO_ItemCategory>("ItemControl/GetItemCategoryByID?ItemCategory=" + ItemCategory);
                var data = serviceResponse.Data;
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategoryByID:For ItemCategory {0}", ItemCategory);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategoryByID:For ItemCategory {0}", ItemCategory);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemCategoryByID:For ItemCategory {0}", ItemCategory);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateItemCategory(DO_ItemCategory obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemControl/AddOrUpdateItemCategory", obj);
                if (serviceResponse.Status == true)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateItemCategory:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateItemCategory:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateItemCategory:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region ItemSubCategory
        /// <summary>
        /// Item Sub Category
        /// </summary>
        /// <returns></returns>
        [Area("ConfigInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECS_06_00()
        {
            return View();
        }
        public async Task<ActionResult> LoadItemSubCategoryTree()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "ISC";
                jsObj.parent = "#";
                jsObj.text = "Item Sub Categories";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("ItemControl/GetItemCategory");
                var Subcategory_res = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemSubCategory>>("ItemControl/GetItemSubCategories");
                if (serviceResponse.Status && Subcategory_res.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ic_list = serviceResponse.Data;
                        foreach (var ic in ic_list)
                        {
                            jsObj = new jsTreeObject();
                            jsObj.id = ic.ItemCategory.ToString();
                            jsObj.text = ic.ItemCategoryDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "ISC";
                            jsObj.state = new stateObject { opened = false, selected = false };
                            treeView.Add(jsObj);


                            if (Subcategory_res.Data != null)
                            {
                                var isc_list = Subcategory_res.Data.Where(x => x.ItemCategory == ic.ItemCategory);
                                foreach (var isc in isc_list)
                                {
                                    jsObj = new jsTreeObject();
                                    jsObj.id = "S" + isc.ItemSubCategory.ToString();
                                    jsObj.text = isc.ItemSubCategoryDesc;
                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                    jsObj.parent = ic.ItemCategory.ToString();
                                    treeView.Add(jsObj);

                                }
                            }
                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategory");
                }
                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:LoadItemSubCategoryTree");
                throw;
            }


        }
        //public async Task<ActionResult> LoadItemSubCategoryTree()
        //{
        //    try
        //    {
        //        List<jsTreeObject> treeView = new List<jsTreeObject>();
        //        string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

        //        jsTreeObject jsObj = new jsTreeObject();
        //        jsObj.id = "ISC";
        //        jsObj.parent = "#";
        //        jsObj.text = "Item Sub Categories";
        //        jsObj.icon =baseURL+ "/images/jsTree/foldergroupicon.png";
        //        jsObj.state = new stateObject { opened = true, selected = false };
        //        treeView.Add(jsObj);
        //        var serviceResponse = await _inventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("ItemControl/GetItemCategory");
        //        if (serviceResponse.Status)
        //        {
        //            if (serviceResponse.Data != null)
        //            {
        //                var ic_list = serviceResponse.Data;
        //                foreach (var ic in ic_list)
        //                {
        //                    jsObj = new jsTreeObject();
        //                    jsObj.id = ic.ItemCategory.ToString();
        //                    jsObj.text = ic.ItemCategoryDesc;
        //                    jsObj.icon =baseURL+ "/images/jsTree/openfolder.png";
        //                    jsObj.parent = "ISC";
        //                    jsObj.state = new stateObject { opened = false, selected = false };
        //                    treeView.Add(jsObj);

        //                    var serviceResponse1 = await _inventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemSubCategory>>("ItemControl/GetItemSubCategoryByCateID?ItemCategory=" + ic.ItemCategory);
        //                    if (serviceResponse1.Status)
        //                    {
        //                        if (serviceResponse1.Data != null)
        //                        {
        //                            var isc_list = serviceResponse1.Data;
        //                            foreach (var isc in isc_list)
        //                            {
        //                                jsObj = new jsTreeObject();
        //                                jsObj.id = "S" + isc.ItemSubCategory.ToString();
        //                                jsObj.text = isc.ItemSubCategoryDesc;
        //                                jsObj.icon =baseURL+ "/images/jsTree/fileIcon.png";
        //                                jsObj.parent = ic.ItemCategory.ToString();
        //                                treeView.Add(jsObj);

        //                            }
        //                        }
        //                    }
        //                    else
        //                    {
        //                        _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetItemSubCategoryByCateID:For ItemCategory {0}", ic.ItemCategory);
        //                    }
        //                }
        //            }
        //        }
        //        else
        //        {
        //            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategory");
        //        }
        //        return Json(treeView);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "UD:LoadItemSubCategoryTree");
        //        throw ex;
        //    }


        //}
        public async Task<ActionResult> GetItemSubCategoryByID(int ItemSubCategory)
        {
            try
            {
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<DO_ItemSubCategory>("ItemControl/GetItemSubCategoryByID?ItemSubCategory=" + ItemSubCategory);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategoryByID:For ItemSubCategory {0}", ItemSubCategory);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategoryByID:For ItemSubCategory {0}", ItemSubCategory);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemSubCategoryByID:For ItemSubCategory {0}", ItemSubCategory);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> AddOrUpdateItemSubCategory(DO_ItemSubCategory obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemControl/AddOrUpdateItemSubCategory", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateItemSubCategory:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateItemSubCategory:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateItemSubCategory:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        public async Task<ActionResult> GetItemSubCategoryByCateID(int ItemCategory)
        {
            try
            {
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemSubCategory>>("ItemControl/GetItemSubCategoryByCateID?ItemCategory=" + ItemCategory);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategoryByCateID:For ItemCategory {0}", ItemCategory);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategoryByCateID:For ItemCategory {0}", ItemCategory);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemSubCategoryByCateID:For ItemCategory {0}", ItemCategory);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region ItemGroupCategoryMapping
        /// <summary>
        /// Item Group Category Link
        /// </summary>
        /// <returns></returns>
        [Area("ConfigInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECS_07_00()
        {

            var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("ItemControl/GetItemCategory");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    var ic_list = serviceResponse.Data.FindAll(w => w.ActiveStatus == true);
                    ViewBag.ItemCategories = ic_list;
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1004_00:GetItemCategory");
            }

            var serviceResponse1 = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemGroup>>("ItemControl/GetItemGroup");
            if (serviceResponse1.Status)
            {
                if (serviceResponse1.Data != null)
                {
                    var ig_list = serviceResponse1.Data.FindAll(w => w.ActiveStatus == true);
                    ViewBag.ItemGroups = ig_list;
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1004_00:GetItemGroup");
            }
            //ViewBag.UserFormRoles = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsDelete = true, IsView = true };
            return View();

        }
        public async Task<ActionResult> LoadItemGroupCateSubCateTree()
        {
            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();
                jsTreeObject jsObj = new jsTreeObject();
                jsObj.id = "IGC";
                jsObj.parent = "#";
                jsObj.text = "Item Group & Category Link";
                jsObj.icon = baseURL + "/images/jsTree/foldergroupicon.png";
                jsObj.state = new stateObject { opened = true, selected = false };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemGroup>>("ItemControl/GetItemGroup");
                var serviceResponse1 = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("ItemControl/GetItemCategoriesByItemGroup");
                var serviceResponse2 = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemSubCategory>>("ItemControl/GetItemSubCategoriesByItemGroupCategory");

                if (serviceResponse.Status && serviceResponse1.Status && serviceResponse2.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var ig_list = serviceResponse.Data.FindAll(w => w.ActiveStatus);
                        foreach (var ig in ig_list)
                        {

                            jsObj = new jsTreeObject();
                            jsObj.id = "G" + ig.ItemGroupId.ToString();
                            jsObj.text = ig.ItemGroupDesc;
                            jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                            jsObj.parent = "IGC";
                            treeView.Add(jsObj);

                            if (serviceResponse1.Status)
                            {
                                if (serviceResponse1.Data != null)
                                {
                                    var ic_list = serviceResponse1.Data.Where(x => x.ItemGroupId == ig.ItemGroupId);
                                    foreach (var ic in ic_list)
                                    {

                                        jsObj = new jsTreeObject();
                                        jsObj.id = "CG" + ig.ItemGroupId.ToString() + ic.ItemCategory.ToString();
                                        jsObj.text = ic.ItemCategoryDesc;
                                        jsObj.icon = baseURL + "/images/jsTree/openfolder.png";
                                        jsObj.parent = "G" + ig.ItemGroupId.ToString();
                                        treeView.Add(jsObj);

                                        if (serviceResponse2.Status)
                                        {
                                            if (serviceResponse2.Data != null)
                                            {
                                                var isc_list = serviceResponse2.Data.Where(x => x.ItemGroupId == ig.ItemGroupId && x.ItemCategory == ic.ItemCategory);

                                                foreach (var isc in isc_list)

                                                {
                                                    jsObj = new jsTreeObject();
                                                    jsObj.id = "SCG" + ig.ItemGroupId.ToString() + ic.ItemCategory.ToString() + isc.ItemSubCategory.ToString();
                                                    jsObj.text = isc.ItemSubCategoryDesc;
                                                    jsObj.icon = baseURL + "/images/jsTree/fileIcon.png";
                                                    jsObj.parent = "CG" + ig.ItemGroupId.ToString() + ic.ItemCategory.ToString();
                                                    treeView.Add(jsObj);


                                                }
                                            }
                                        }
                                        else
                                        {
                                            _logger.LogError(new Exception(serviceResponse2.Message), "UD:LoadItemGroupCateSubCateTree:GetItemCategoryByItemGroupCategory: For ItemGroup:" + ig.ItemGroupId + "&ItemCategory=" + ic.ItemCategory);

                                        }


                                    }

                                }

                            }
                            else
                            {
                                _logger.LogError(new Exception(serviceResponse1.Message), "UD:LoadItemGroupCateSubCateTree:GetItemCategoryByItemGroupID: For ItemGroup:" + ig.ItemGroupId);
                            }

                        }
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:LoadItemGroupCateSubCateTree:GetItemGroup");
                }
                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:LoadItemGroupCateSubCateTree");
                throw;
            }



        }
        public async Task<ActionResult> ItemGroupCateSubCateMapping(DO_ItemGroupCategory obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedOn = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemControl/ItemGroupCateSubCateMapping", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:ItemGroupCateSubCateMapping:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ItemGroupCateSubCateMapping:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ItemGroupCateSubCateMapping:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message.ToString() });
            }
        }
        public async Task<ActionResult> GetMappingRecord(int ItemGroupID, int ItemCategory, int ItemSubCategory)
        {
            try
            {
                var serviceResponse = await _eSyaConfigInventoryAPIServices.HttpClientServices.GetAsync<DO_ItemGroupCategory>("ItemControl/GetMappinRecord?ItemGroupID=" + ItemGroupID + "&ItemCategory=" + ItemCategory + "&ItemSubCategory=" + ItemSubCategory);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappingRecord:For ItemGroupID {0}, ItemCategory {1},ItemSubCategory {2}", ItemGroupID, ItemCategory, ItemSubCategory);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMappingRecord:For ItemGroupID {0}, ItemCategory {1},ItemSubCategory {2}", ItemGroupID, ItemCategory, ItemSubCategory);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMappingRecord:For ItemGroupID {0}, ItemCategory {1},ItemSubCategory {2}", ItemGroupID, ItemCategory, ItemSubCategory);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.Message.ToString() });
            }
        }
        #endregion
    }
}
