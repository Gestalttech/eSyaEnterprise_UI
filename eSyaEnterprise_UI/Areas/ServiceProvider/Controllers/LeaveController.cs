using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Controllers
{
    [SessionTimeout]
    public class LeaveController : Controller
    {

        #region Doctor Leave
        [Area("ServiceProvider")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESP_02_00()
        {
            return View();
        }
        #endregion region
    }
}
