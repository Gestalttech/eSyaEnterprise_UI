using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ViewAdmin.Controllers
{
    [SessionTimeout]
    public class ApproverController : Controller
    {
        [Area("ViewAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAP_02_00()
        {
            return View();
        }
    }
}
