using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Controllers
{
    [AllowAnonymous]
    public class KeepAliveController : Controller
    {
        //
        // GET: /KeepAlive
        [AllowAnonymous]
        public IActionResult Index()
        {
            return Content("Stay Connected!");
        }
    }
}
