using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    [SessionTimeout]
    public class VendorLinkController : Controller
    {
        [Area("ManagePharma")]
        public IActionResult EMP_03_00()
        {
            return View();
        }
    }
}
