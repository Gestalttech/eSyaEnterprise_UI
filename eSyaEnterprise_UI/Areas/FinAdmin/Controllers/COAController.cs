using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    [SessionTimeout]
    public class COAController : Controller
    {
        [Area("FinAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EFA_04_00()
        {
            return View();
        }
    }
}
