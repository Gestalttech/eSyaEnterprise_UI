using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.DocumentControl.Data;
using eSyaEnterprise_UI.Areas.DocumentControl.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.DocumentControl.Controllers
{
    public class CalendarController : Controller
    {
        private readonly IeSyaDocumentControlAPIServices _documentControlAPIServices;
        private readonly ILogger<CalendarController> _logger;


        public CalendarController(IeSyaDocumentControlAPIServices documentControlAPIServices, ILogger<CalendarController> logger)
        {
            _documentControlAPIServices = documentControlAPIServices;
            _logger = logger;
        }

        #region Calendar Details


        [Area("DocumentControl")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EDC_01_00()
        {
            var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1511_00:GetBusinessKey");
            }
            return View();
        }
        /// <summary>
        /// Getting Calendar Header for Grid
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetCalendarHeaders(int businesskey)
        {
            try
            {
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessCalendarLink>>("BusinessCalendar/GetCalendarHeaders?businesskey=" + businesskey);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCalendarHeaders");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCalendarHeaders");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Calendar Header 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertCalendarDetails(DO_BusinessCalendarLink obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("BusinessCalendar/InsertBusinessKeyIntoCalendar", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertCalendarDetails:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Calendar detail
    }
}
