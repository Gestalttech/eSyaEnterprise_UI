using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Approval.Data;
using eSyaEnterprise_UI.Areas.Approval.Models;
using eSyaEnterprise_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Areas.Approval.Controllers
{
    [SessionTimeout]
    public class ProcessController : Controller
    {
        private readonly IeSyaApprovalProcessAPIServices _eSyaApprovalProcessAPIServices;
        private readonly ILogger<ProcessController> _logger;

        public ProcessController(IeSyaApprovalProcessAPIServices eSyaApprovalProcessAPIServices, ILogger<ProcessController> logger)
        {
            _eSyaApprovalProcessAPIServices = eSyaApprovalProcessAPIServices;
            _logger = logger;
        }
        #region Define Approval Process
        [Area("Approval")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAP_01_00()
        {
            try
            {
                var serviceResponse = await _eSyaApprovalProcessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                if (serviceResponse.Status)
                {
                    ViewBag.BusinessKeyList = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return View();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
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
