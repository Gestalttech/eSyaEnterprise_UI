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
    [SessionTimeout]
    public class DocumentController : Controller
    {
        private readonly IeSyaDocumentControlAPIServices _documentControlAPIServices;
        private readonly ILogger<DocumentController> _logger;

        public DocumentController(IeSyaDocumentControlAPIServices documentControlAPIServices, ILogger<DocumentController> logger)
        {
            _documentControlAPIServices = documentControlAPIServices;
            _logger = logger;
        }

        #region Define Business - Document Link --new
        [Area("DocumentControl")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EDC_02_00()
        {
            var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessCalendarLink>>("Document/GetBusinesslinkedCalendarkeys");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.CalenderKeys = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.CalenderKey.ToString(),
                        Text = b.CalenderKey,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:EDC_02_00:GetBusinesslinkedCalendarkeys");
            }
            return View();
        }
        
        /// <summary>
        ///Get All Active Locations 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllBusinessLocations()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Business Locations",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey");

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.BusinessKey.ToString(),
                            text = fm.BusinessKey.ToString() + '.' + fm.LocationDescription,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessKey");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Menu forms  Linked  with Location
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetMenuFormslinkwithLocation(int businesskey)
        {

            try
            {

                var parameter = "?businesskey=" + businesskey;
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_FormBusinessLink>>("Document/GetMenuFormslinkwithLocation" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMenuFormslinkwithLocation:For businesskey {0} ", businesskey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get Document Control Standard
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetDocumentControlStandard(int formId,int businesskey)
        {
            try
            {
                var parameter = "?formId=" + formId + "&businesskey=" + businesskey;
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.GetAsync<List<DO_DocumentControlStandard>>("Document/GetDocumentControlStandard"+ parameter);
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
        /// Insert Or Update Business wise Document Control Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinesswiseDocumentControlLink(List<DO_BusinessDocument_Link> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.CalendarKey = string.Empty;
                    return true;
                });
                var truedocuments = obj.Where(x => x.ActiveStatus).ToList();
                if (truedocuments.Count > 1)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please select only one Document" });
                }
                var serviceResponse = await _documentControlAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Document/InsertOrUpdateBusinesswiseDocumentControlLink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinesswiseDocumentControl:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }

        }
        #endregion
    }
}
