using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Purchase.Controllers
{
    [SessionTimeout]
    public class TermsController : Controller
    {
        [Area("Purchase")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPO_01_00()
        {
            return View();
        }


    }
}
