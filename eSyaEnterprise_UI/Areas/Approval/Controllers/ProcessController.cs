using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Approval.Controllers
{
    [SessionTimeout]
    public class ProcessController : Controller
    {
        #region Define Approval Process
        [Area("Approval")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAP_01_00()
        {
            return View();
        }
        

        #region Level based Approval - PartialView
        [Area("Approval")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult _EAP_01_P1()
        {
            return View();
        }
        #endregion


        #endregion
    }
}
