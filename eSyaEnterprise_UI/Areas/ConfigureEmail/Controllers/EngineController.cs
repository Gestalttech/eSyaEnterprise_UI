using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Controllers
{
    [SessionTimeout]
    public class EngineController : Controller
    {
        #region Define Email Variable Component
        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EME_01_00()
        {
            return View();
        }
        #endregion

        #region Define Email Template
        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EME_02_00()
        {
            return View();
        }
        #endregion
    }
}
