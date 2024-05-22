using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using eSyaEnterprise_UI.Areas.ManageInventory.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Controllers
{
    [SessionTimeout]
    public class StoresController : Controller
    {
        private readonly IeSyaInventoryAPIServices _eSyaInventoryAPIServices;
        private readonly ILogger<StoresController> _logger;

        public StoresController(IeSyaInventoryAPIServices eSyainventoryAPIServices, ILogger<StoresController> logger)
        {
            _eSyaInventoryAPIServices = eSyainventoryAPIServices;
            _logger = logger;
        }

        #region Map Item to Business & Stores

        [Area("ManageInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMI_02_00()
        {
            try
            {

                var Um_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_UnitofMeasure>>("Common/GetUnitofMeasure");
                var Ig_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemGroup>>("Common/GetItemGroup");
                var Im_serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemCodes>>("ItemCodes/GetItemList");

                if (Um_serviceResponse.Status && Ig_serviceResponse.Status && Im_serviceResponse.Status)
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
        ///Get All Active Locations 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllBusinessLocations()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Business Locations",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Common/GetBusinessKey");

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.BusinessKey.ToString(),
                            text = fm.BusinessKey.ToString() + '.' + fm.LocationDescription,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        ///Get Business Item Store Link
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetBusinessItemStoreLink(int BusinessKey, int ItemCode)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey + "&ItemCode=" + ItemCode;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemStoreLink>>("ItemCodes/GetBusinessItemStoreLink" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessItemStoreLink:For BusinessKey {0} With ItemCode {1}", BusinessKey, ItemCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessItemStoreLink:For BusinessKey {0} With ItemCode {1}", BusinessKey, ItemCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessItemStoreLink:For BusinessKey {0} With ItemCode {1}", BusinessKey, ItemCode);
                throw ex;
            }
        }

        /// <summary>
        ///Get Portfolio Store Info
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetPortfolioStoreInfo(int BusinessKey, int StoreCode)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey + "&StoreCode=" + StoreCode;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_ItemStoreLink>>("ItemCodes/GetPortfolioStoreInfo" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPortfolioStoreInfo:For BusinessKey {0} With ItemCode {1}", BusinessKey, StoreCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPortfolioStoreInfo:For BusinessKey {0} With ItemCode {1}", BusinessKey, StoreCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPortfolioStoreInfo:For BusinessKey {0} With ItemCode {1}", BusinessKey, StoreCode);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Business Item Store Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinessItemStoreLink(List<DO_ItemStoreLink> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ItemCodes/InsertOrUpdateBusinessItemStoreLink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessItemStoreLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }

        }
        #endregion
    }
}
