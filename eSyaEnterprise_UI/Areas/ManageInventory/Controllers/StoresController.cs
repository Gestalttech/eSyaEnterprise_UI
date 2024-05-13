using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using eSyaEnterprise_UI.Areas.ManageInventory.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        #endregion
    }
}
