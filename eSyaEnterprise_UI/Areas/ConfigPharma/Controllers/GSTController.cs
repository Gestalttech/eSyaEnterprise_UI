using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class GSTController : Controller
    {
        #region HSN GST Master
        [Area("ConfigPharma")]
        public IActionResult EPH_08_00()
        {
            return View();
        }
        #endregion
    }
}
