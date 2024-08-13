using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    [SessionTimeout]
    public class CostCenterController : Controller
    {
        #region Manage Cost Center
        [Area("FinAdmin")]
        public IActionResult EFA_01_00()
        {
            return View();
        }
        #endregion
    }
}
