using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Vendor.Controllers
{
    public class BlackListController : Controller
    {

        #region BlackList
        [Area("Vendor")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EVN_03_00()
        {
            return View();
        }
        #endregion 
    }
}
