using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEssentials_UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class ControlController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<ControlController> _logger;

        public ControlController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<ControlController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }

        #region Document Control
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_08_00()
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
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlMaster>>("Control/GetDocumentControlMaster");
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
        /// Getting Parameters By Document ID
        /// </summary>

        [HttpGet]
        public async Task<JsonResult> GetDocumentParametersByID(int documentID)
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("Control/GetDocumentParametersByID?documentID=" + documentID);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDocumentParametersByID:documentID {0} ", documentID);
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
        public async Task<JsonResult> AddOrUpdateDocumentControl(DO_DocumentControlMaster obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Control/AddOrUpdateDocumentControl", obj);
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
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Control/ActiveOrDeActiveDocumentControlMaster" + parameter);
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

        #region FORM LINK TO DOCUMENT
        
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_09_00()
        {
            return View();
        }
        /// <summary>
        ///Get Linked forms with documents for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetFormDocumentlink(int formID)
        {

            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_FormDocumentLink>>("Control/GetFormDocumentlink?formID="+formID);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormLinkedDocuments");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormLinkedDocuments");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Linked forms with documents for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetFormsForDocumentControl()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("Control/GetFormsForDocumentControl");
                
                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.FormID.ToString(),
                            text = fm.FormCode.ToString() + '.' + fm.FormName,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFormsForDocumentControl");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormLinkedDocuments");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Form Link with documents
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateFormDocumentLinks(List<DO_FormDocumentLink> obj)
        {

            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    return true;
                });

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Control/UpdateFormDocumentLinks", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateFormDocumentLinks:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

       

        #endregion FORM LINK TO DOCUMENT

        #region Calendar Definition
        /// <summary>
        /// Calendar Control
        /// </summary>
        /// <returns></returns>
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_21_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");
                if (serviceResponse.Status)
                {
                    ViewBag.BusinessKeys = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
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
        /// Getting Calendar Headers by Business key for Grid
        /// UI-Param--Business Key
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetCalendarHeadersbyBusinessKey(int Businesskey)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CalendarDefinition>>("Control/GetCalendarHeadersbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCalendarHeadersbyBusinessKey:For Businesskey {0}", Businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFinancialYearbyBusinessKey:For Businesskey {0}", Businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Getting Calendar Header for Grid
        /// </summary>

        [HttpPost]
        public async Task<JsonResult> GetCalendarHeaders()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CalendarDefinition>>("Control/GetCalendarHeaders");
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
        /// Insert Calendar Header & Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertCalendarHeaderAndDetails([FromBody] DO_CalendarDefinition calendarheader)
        {

            try
            {
                calendarheader.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                calendarheader.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                calendarheader.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Control/InsertCalendarHeaderAndDetails", calendarheader);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertCalendarHeaderAndDetails:params:" + JsonConvert.SerializeObject(calendarheader));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        #endregion
    }
}
