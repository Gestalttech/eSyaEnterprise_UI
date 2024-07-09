using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEssentials_UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class DiscountController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<DiscountController> _logger;
        public DiscountController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<DiscountController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        #region Manage Patient Category Discounts
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_07_00()
        {
            try
            {
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
                if (serviceResponse.Status)
                {
                    ViewBag.BusinessKeyList = serviceResponse.Data.Select(a => new SelectListItem
                    {
                        Value = a.BusinessKey.ToString(),
                        Text = a.LocationDescription.ToString()
                    });
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActivePatientTypes");
                return Json(new DO_ResponseParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

               
        }
        #endregion
    }

