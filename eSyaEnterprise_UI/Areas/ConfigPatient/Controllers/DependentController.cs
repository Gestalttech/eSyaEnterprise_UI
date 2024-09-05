using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class DependentController : Controller
    {
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPM_08_00()
        {
            return View();
        }
    }
}
