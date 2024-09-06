using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.EndUser.Controllers
{
    [SessionTimeout]
    public class ApprovalController : Controller
    {
        #region Map User to Approvals
        [Area("EndUser")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EEU_12_00()
        {
            return View();
        }
        #endregion
    }
}
