using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Controllers
{
    [SessionTimeout]
    public class DepreciationController : Controller
    {
        [Area("ConfigFAsset")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EFC_03_00()
        {
            return View();
        }
    }
}
