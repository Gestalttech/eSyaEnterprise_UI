using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    [SessionTimeout]
    public class DrugBrandsController : Controller
    {
        [Area("ManagePharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EMP_01_00()
        {
            return View();
        }
    }
}
