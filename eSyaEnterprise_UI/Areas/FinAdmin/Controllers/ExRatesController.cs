using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    public class ExRatesController : Controller
    {
        [Area("FinAdmin")]
        public IActionResult EFA_02_00()
        {
            return View();
        }
    }
}
