using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ManageInventory.Controllers
{
    [SessionTimeout]
    public class ItemController : Controller
    {
        private readonly IeSyaInventoryAPIServices _eSyaInventoryAPIServices;
        private readonly ILogger<ItemController> _logger;

        public ItemController(IeSyaInventoryAPIServices eSyainventoryAPIServices, ILogger<ItemController> logger)
        {
            _eSyaInventoryAPIServices = eSyainventoryAPIServices;
            _logger = logger;
        }

        #region Service Item Link
        [Area("ManageInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EMI_03_00()
        {
            return View();
        }
        #endregion
    }
}
