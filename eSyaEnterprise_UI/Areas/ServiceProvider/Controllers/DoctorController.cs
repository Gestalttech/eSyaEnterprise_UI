using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Controllers
{
    [SessionTimeout]
    public class DoctorController : Controller
    {

        #region Manage Doctor
        [Area("ServiceProvider")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESP_01_00()
        {
            return View();
        }

        #region Doctor Profile
        [Area("ServiceProvider")]
        public IActionResult _DoctorProfile()
        {
            return View();
        }
        #endregion

        #region About Doctor
        [Area("ServiceProvider")]
        public IActionResult _AboutDoctor()
        {
            return View();
        }
        #endregion


        #region PhotoAndSignature
        [Area("ServiceProvider")]
        public IActionResult _PhotoAndSignature()
        {
            return View();
        }
        #endregion


        #region Address

        [Area("ServiceProvider")]
        public IActionResult _Address()
        {
            return View();
        }
        #endregion

        #region Statutory Details
        [Area("ServiceProvider")]
        public IActionResult _StatutoryDetails()
        {
            return View();
        }

        #endregion

        #region Business Link
        [Area("ServiceProvider")]
        public IActionResult _BusinessLink()
        {
            return View();
        }
        #endregion


        #region Specialty Link
        [Area("ServiceProvider")]
        public IActionResult _SpecialtyLink()
        {
            return View();

        }
        #endregion

        #region ClinicLink
        [Area("ServiceProvider")]
        public IActionResult _ClinicLink()
        {
            return View();

        }
        #endregion


        #region ConsultationRates
        [Area("ServiceProvider")]
        public IActionResult _ConsultationRates()
        {
            return View();

        }
        #endregion

        #endregion
    }
}
