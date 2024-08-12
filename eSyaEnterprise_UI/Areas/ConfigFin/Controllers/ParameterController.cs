using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class ParameterController : Controller
    {
        #region Parameters
        [Area("ConfigFin")]
        public IActionResult EAC_04_00()
        {
            return View();
        }
        #endregion
    }
}
