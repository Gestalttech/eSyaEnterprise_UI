using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class VoucherTypeController : Controller
    {
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAC_02_00()
        {
            return View();
        }
    }
}
