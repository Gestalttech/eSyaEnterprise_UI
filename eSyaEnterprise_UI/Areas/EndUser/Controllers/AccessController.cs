using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    public class AccessController : Controller
    {
        [Area("EndUser")]
        public IActionResult EEU_06_00()
        {
            return View();
        }
    }
}
