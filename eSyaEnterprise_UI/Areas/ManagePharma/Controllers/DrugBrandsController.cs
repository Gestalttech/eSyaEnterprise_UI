using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManagePharma.Data;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.ManagePharma.Models;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    [SessionTimeout]
    public class DrugBrandsController : Controller
    {
        private readonly IeSyaPharmaAPIServices _eSyaPharmaAPIServices;
        private readonly ILogger<DrugBrandsController> _logger;

        public DrugBrandsController(IeSyaPharmaAPIServices eSyaPharmaAPIServices, ILogger<DrugBrandsController> logger)
        {
            _eSyaPharmaAPIServices = eSyaPharmaAPIServices;
            _logger = logger;
        }
        [Area("ManagePharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EMP_01_00()
        {
            return View();
        }
    }
}
