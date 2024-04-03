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
    public class DocumentControlController : Controller
    {
        private readonly IeSyaDocumentControlAPIServices _documentControlAPIServices;
        private readonly ILogger<DocumentControlController> _logger;


        public DocumentControlController(IeSyaDocumentControlAPIServices documentControlAPIServices, ILogger<DocumentControlController> logger)
        {
            _documentControlAPIServices = documentControlAPIServices;
            _logger = logger;
        }
        #region Map Document Control to Calendar Business Link

        [Area("DocumentControl")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EDC_01_00()
        {
            try
            {
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
                var documentResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControl>>("BusinessCalendar/GetActiveDocuments");

                if (serviceResponse.Status && documentResponse.Status)
                {
                    ViewBag.BusinessKeys = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                    ViewBag.Documents = documentResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.DocumentId.ToString(),
                        Text = b.DocumentDesc,
                    }).ToList();
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Business Calendar for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinesslinkedCalendarkeys(int businessKey)
        {

            try
            {

                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessCalendar>>("BusinessCalendar/GetBusinesslinkedCalendarkeys" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinesslinkedCalendarkeys:For businessKey {0}", businessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinesslinkedCalendarkeys:For businessKey {0} ", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Business Calendar for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessCalendarBYBusinessKey(int businessKey)
        {

            try
            {

                var parameter = "?businessKey=" + businessKey;
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessCalendar>>("BusinessCalendar/GetBusinessCalendarBYBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessCalendarBYBusinessKey:For businessKey {0}", businessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessCalendarBYBusinessKey:For businessKey {0} ", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        /// Insert or Update Business Calendar
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinessCalendar(DO_BusinessCalendar obj)
        {

            try
            {

                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _documentControlAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("BusinessCalendar/InsertOrUpdateBusinessCalendar", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessCalendar:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
