using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    public class RateContractController : Controller
    {
        [Area("ManagePharma")]
        public IActionResult EMP_02_00()
        {
            return View();
        }
    }
}

