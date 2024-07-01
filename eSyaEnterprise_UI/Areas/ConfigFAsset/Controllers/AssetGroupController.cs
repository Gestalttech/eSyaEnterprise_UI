using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigFAsset.Controllers
{
    [SessionTimeout]
    public class AssetGroupController : Controller
    {
        #region Define Asset Groups
        [Area("ConfigFAsset")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EFC_01_00()
        {
            return View();
        }
        #endregion
    }
}
