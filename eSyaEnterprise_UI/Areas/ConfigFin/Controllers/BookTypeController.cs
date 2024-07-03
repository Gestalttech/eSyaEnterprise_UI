using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class BookTypeController : Controller
    {
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAC_01_00()
        {
            return View();
        }
    }
}
