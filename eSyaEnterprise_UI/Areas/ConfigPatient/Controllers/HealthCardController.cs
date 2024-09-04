using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class HealthCardController : Controller
    {

        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPM_06_00()
        {
            return View();
        }
    }
}
