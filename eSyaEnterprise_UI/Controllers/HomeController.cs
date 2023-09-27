using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace eSyaEnterprise_UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult ContactUs()
        {
            return View();
        }
        public IActionResult EmployeePayroll()
        {
            return View();
        }
        public IActionResult SideBar()
        {
            return View();
        }
        public IActionResult PaymentScreen()
        {
            return View();
        }
        public IActionResult diaHome()
        {
            return View();
        }
        public IActionResult diaHome_en()
        {
            return View();
        }
        public IActionResult diaHome_ar()
        {
            return View();
        }
        public IActionResult diaDoctorProfile()
        {
            return View();
        }
        public IActionResult diaDoctorProfile_en()
        {
            return View();
        }
        public IActionResult diaDoctorProfile_ar()
        {
            return View();
        }
        public IActionResult diaLocation()
        {
            return View();
        }
        public IActionResult diaVideos_en()
        {
            return View();
        }
        public IActionResult diaVideos_ar()
        {
            return View();
        }
        public IActionResult diaFAQ_en()
        {
            return View();
        }
        public IActionResult diaFAQ_ar()
        {
            return View();
        }
        public IActionResult diaPostSurgeryInstructions_en()
        {
            return View();
        }
        public IActionResult diaPostSurgeryInstructions_ar()
        {
            return View();
        }
        public IActionResult diaContact_en()
        {
            return View();
        }
        public IActionResult diaContact_ar()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            return LocalRedirect(returnUrl);
        }
    }
}