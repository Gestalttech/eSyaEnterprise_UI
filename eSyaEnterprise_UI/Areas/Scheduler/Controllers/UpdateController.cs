using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.Scheduler.Controllers
{
    [SessionTimeout]
    public class UpdateController : Controller
    {
        
        #region Schedule Update
        [Area("Scheduler")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESP_05_00()
        {
            return View();
        }
        #endregion
    }
}
