using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Purchase.Controllers
{
    [SessionTimeout]
    public class OrderController : Controller
    {
        [Area("Purchase")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPO_02_00()
        {
            return View();
        }
    }
}
