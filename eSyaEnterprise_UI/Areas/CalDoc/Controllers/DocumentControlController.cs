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
    [SessionTimeout]
    public class DocumentControlController : Controller
    {
        private readonly IeSyaCalDocAPIServices _eSyaCalDocAPIServices;
        private readonly ILogger<DocumentControlController> _logger;
        public DocumentControlController(IeSyaCalDocAPIServices eSyaCalDocAPIServices, ILogger<DocumentControlController> logger)
        {
            _eSyaCalDocAPIServices = eSyaCalDocAPIServices;
            _logger = logger;
        }
        #region Document Control
        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task <IActionResult> ECD_02_00()
        {
            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlMaster>>("DocumentControl/GetActiveDocumentControlMaster");
                if (serviceResponse.Status)
                {
                    ViewBag.DocumentMaster = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.DocumentId.ToString(),
                        Text = b.DocumentDesc,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveDocumentControlMaster");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveDocumentControlMaster");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Document Controls for Grid
        /// </summary>

        [HttpGet]
        public async Task<JsonResult> GetDocumentControlStandardbyDocumentId(int DocumentId)
        {
            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlStandard>>("DocumentControl/GetDocumentControlStandardbyDocumentId?DocumentId="+ DocumentId);
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
        public async Task<JsonResult> AddOrUpdateDocumentControlStandard(DO_DocumentControlStandard obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DocumentControl/AddOrUpdateDocumentControlStandard", obj);
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
        public async Task<JsonResult> ActiveOrDeActiveDocumentStandardControl(bool status, int documentId,int ComboId)
        {

            try
            {

                var parameter = "?status=" + status + "&documentId=" + documentId + "&ComboId="+ ComboId;
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DocumentControl/ActiveOrDeActiveDocumentStandardControl" + parameter);
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


        #region eSya Document Control Master
        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ECD_05_00()
        {
            return View();
        }


        /// <summary>
        /// Getting Document Controls for Grid
        /// </summary>

        [HttpGet]
        public async Task<JsonResult> GetDocumentControlMaster()
        {
            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlMaster>>("DocumentControl/GetDocumentControlMaster");
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
        public async Task<JsonResult> AddOrUpdateDocumentControlMaster(DO_DocumentControlMaster obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DocumentControl/AddOrUpdateDocumentControlMaster", obj);
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
        public async Task<JsonResult> ActiveOrDeActiveDocumentControlMaster(int DocumentId, bool status)
        {

            try
            {

                var parameter = "?status=" + status + "&DocumentId=" + DocumentId;
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DocumentControl/ActiveOrDeActiveDocumentControlMaster" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDocumentControl:For documentId {0} ", DocumentId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

    }
}
