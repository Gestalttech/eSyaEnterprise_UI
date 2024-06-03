using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Utility;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigSpecialty.Data;

namespace eSyaEnterprise_UI.Areas.ConfigSpecialty.Controllers
{
    [SessionTimeout]
    public class ClinicController : Controller
    {
        private readonly IeSyaConfigSpecialtyAPIServices _eSyaConfigSpecialtyAPIServices;
        private readonly ILogger<ClinicController> _logger;

        public ClinicController(IeSyaConfigSpecialtyAPIServices eSyaConfigSpecialtyAPIServices, ILogger<ClinicController> logger)
        {
            _eSyaConfigSpecialtyAPIServices = eSyaConfigSpecialtyAPIServices;
            _logger = logger;
        }

        #region Map Specialty clinic
        [Area("ConfigSpecialty")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECP_07_00()
        {
            return View();
        }
        #endregion
    }
}
