using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.CalDoc.Data;
using eSyaEnterprise_UI.Areas.CalDoc.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.CalDoc.Controllers
{
    public class CalendarControlController : Controller
    {
        private readonly IeSyaCalDocAPIServices _eSyaCalDocAPIServices;
        private readonly ILogger<CalendarControlController> _logger;

        public CalendarControlController(IeSyaCalDocAPIServices eSyaCalDocAPIServices, ILogger<CalendarControlController> logger)
        {
            _eSyaCalDocAPIServices = eSyaCalDocAPIServices;
            _logger = logger;
        }

        #region Calendar Header
        /// <summary>
        /// Calendar Control
        /// </summary>
        /// <returns></returns>
        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECD_01_00()
        {
            return View();
        }
        /// <summary>
        /// Getting Calendar Header for Grid
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetCalendarHeaders()
        {
            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_CalendarHeader>>("CalendarControl/GetCalendarHeaders");
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
        public async Task<JsonResult> InsertCalendarHeader([FromBody] DO_CalendarHeader obj)
        {

            try
            {
                if (obj.CalenderType == "NA")
                {
                    obj.StartMonth = 0;
                }
                else
                {
                    obj.StartMonth = obj.FromDate.Month;
                }
                
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CalendarControl/InsertCalendarHeader", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertCalendarHeader:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        #endregion

        #region Document Control
        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECD_02_00()
        {
            try
            {
                return View();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ECA_09_00");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Document Controls for Grid
        /// </summary>

        [HttpGet]
        public async Task<JsonResult> GetDocumentControlMaster()
        {
            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlStandard>>("DocumentControl/GetDocumentControlMaster");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDocumentControlMaster");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDocumentControlMaster");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Document Control
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> AddOrUpdateDocumentControl(DO_DocumentControlStandard obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DocumentControl/AddOrUpdateDocumentControl", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateDocumentControl:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Document Control
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDocumentControl(bool status, int documentId)
        {

            try
            {

                var parameter = "?status=" + status + "&documentId=" + documentId;
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DocumentControl/ActiveOrDeActiveDocumentControlMaster" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDocumentControl:For documentId {0} ", documentId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
