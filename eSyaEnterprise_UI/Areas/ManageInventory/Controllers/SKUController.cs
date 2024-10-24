﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using eSyaEnterprise_UI.Areas.ManageInventory.Models;
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

namespace eSyaEnterprise_UI.Areas.ManageInventory.Controllers
{
    [SessionTimeout]
    public class SKUController : Controller
    {
        private readonly IeSyaInventoryAPIServices _eSyaInventoryAPIServices;
        private readonly ILogger<SKUController> _logger;

        public SKUController(IeSyaInventoryAPIServices eSyainventoryAPIServices, ILogger<SKUController> logger)
        {
            _eSyaInventoryAPIServices = eSyainventoryAPIServices;
            _logger = logger;
        }
        #region Item Creation

        /// <summary>
        /// Item Creation
        /// </summary>
        /// <returns></returns>
        [Area("ManageInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMI_01_00()
        {
            try
            {
                
                var Um_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_UnitofMeasure>>("Common/GetUnitofMeasure");
                var Ig_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemGroup>>("Common/GetItemGroup");
                var Im_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCodes>>("ItemCodes/GetItemList");

                if ( Um_serviceResponse.Status && Ig_serviceResponse.Status && Im_serviceResponse.Status)
                {
                   
                        ViewBag.UOMList = Um_serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.UnitOfMeasure.ToString(),
                            Text = b.UnitOfMeasureDesc,
                        }).ToList();

                        ViewBag.ItemGroupList = Ig_serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.ItemGroupId.ToString(),
                            Text = b.ItemGroupDesc,
                        }).ToList();

                        ViewBag.ItemList = Im_serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.ItemCode.ToString(),
                            Text = b.ItemDescription,
                        }).ToList();
                    
                }
                else
                {
                    _logger.LogError(new Exception(Im_serviceResponse.Message), "UD:ItemMaster");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD: ItemMaster");
                throw ex;
            }
        }

        /// <summary>
        ///Get Item Category
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetItemCategory(int ItemGroup)
        {
            try
            {
                var parameter = "?ItemGroup=" + ItemGroup;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCategory>>("Common/GetItemCategory" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategory:For ItemGroup {0}", ItemGroup);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemCategory:For ItemGroup {0}", ItemGroup);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemCategory:For ItemGroup {0}", ItemGroup);
                throw ex;
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Item Category
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetItemSubCategory(int ItemCategory)
        {
            try
            {
                var parameter = "?ItemCategory=" + ItemCategory;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemSubCategory>>("Common/GetItemSubCategory" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategory:For ItemCategory {0}", ItemCategory);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemSubCategory:For ItemCategory {0}", ItemCategory);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemSubCategory:For ItemCategory {0}", ItemCategory);
                throw ex;
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Item Master List
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetItemMaster(int ItemGroup, int ItemCategory, int ItemSubCategory)
        {
            try
            {
                var parameter = "?ItemGroup=" + ItemGroup + "&ItemCategory=" + ItemCategory + "&ItemSubCategory=" + ItemSubCategory;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCodes>>("ItemCodes/GetItemMaster" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemMaster:For ItemGroup {0} ItemCategory {1} With ItemSubCategory entered {2}", ItemGroup, ItemCategory, ItemSubCategory);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemMaster:For ItemGroup {0} ItemCategory {1} With ItemSubCategory entered {2}", ItemGroup, ItemCategory, ItemSubCategory);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemMaster:For ItemGroup {0} ItemCategory {1} With ItemSubCategory entered {2}", ItemGroup, ItemCategory, ItemSubCategory);
                throw ex;
            }
        }

        /// <summary>
        ///Get Item Codes Details
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetItemDetails(int ItemCode)
        {
            try
            {
                var parameter = "?ItemCode=" + ItemCode;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCodes>>("ItemCodes/GetItemDetails" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemDetails:For ItemCode {0}", ItemCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemDetails:For ItemCode {0}", ItemCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemDetails:For ItemCode {0}", ItemCode);
                throw ex;
            }
        }

        /// <summary>
        /// Get Item parameter
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetItemParameterList(int ItemCode)
        {
            try
            {
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<DO_ItemCodes>("ItemCodes/GetItemParameterList?ItemCode=" + ItemCode);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemParameterList:For ItemCode {0}", ItemCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetItemParameterList:For ItemCode {0}", ItemCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetItemParameterList:For ItemCode {0}", ItemCode);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Item Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateItemCodes(DO_ItemCodes ItemCodes)
        {
            try
            {
                if (string.IsNullOrEmpty(ItemCodes.ItemGroup.ToString()) || ItemCodes.ItemGroup == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Item Group" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.ItemClass.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Item Class" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.ItemDescription))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Item Description" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.UnitOfMeasure.ToString()) || ItemCodes.UnitOfMeasure == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Unit of Measure" });
                }
                
                else if (string.IsNullOrEmpty(ItemCodes.InventoryClass.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Inventory Class" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.ItemClass.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Item Class" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.ItemSource.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Item Source" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.ItemCriticality.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Item Criticality" });
                }
                else if (string.IsNullOrEmpty(ItemCodes.PackSize.ToString()) || ItemCodes.PackSize == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Pack Size" });
                }
                else
                {
                    ItemCodes.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    ItemCodes.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    ItemCodes.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    //ItemCodes.Skuid = ItemCodes.ItemCode;
                    ItemCodes.Skutype = "M";
                    if (ItemCodes.ItemCode == 0)
                    {
                        var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemCodes/InsertItemCodes", ItemCodes);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateItemCodes:params:" + JsonConvert.SerializeObject(ItemCodes));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = _eSyaInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemCodes/UpdateItemCodes", ItemCodes).Result;
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateItemCodes:params:" + JsonConvert.SerializeObject(ItemCodes));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateItemCodes:params:" + JsonConvert.SerializeObject(ItemCodes));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        #endregion Item Creation
    }
}
