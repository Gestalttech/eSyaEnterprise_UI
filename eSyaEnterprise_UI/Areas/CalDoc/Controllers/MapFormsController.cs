using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.CalDoc.Data;
using eSyaEnterprise_UI.Areas.CalDoc.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.CalDoc.Controllers
{
    public class MapFormsController : Controller
    {
        private readonly IeSyaCalDocAPIServices _eSyaCalDocAPIServices;
        private readonly ILogger<MapFormsController> _logger;

        public MapFormsController(IeSyaCalDocAPIServices eSyaCalDocAPIServices, ILogger<MapFormsController> logger)
        {
            _eSyaCalDocAPIServices = eSyaCalDocAPIServices;
            _logger = logger;
        }

        #region FORM LINK TO DOCUMENT

        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECD_03_00()
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
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_FormDocumentLink>>("DocumentControl/GetFormDocumentlink?formID=" + formID);
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

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("DocumentControl/GetFormsForDocumentControl");

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

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DocumentControl/UpdateFormDocumentLinks", obj);
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


        #region DOCUMENT LINK TO FORM

        [Area("CalDoc")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECD_04_00()
        {
            return View();
        }

        /// <summary>
        ///Get Linked forms with documents for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDocumentFormlink(int documentID)
        {

            try
            {
                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_FormDocumentLink>>("DocumentControl/GetDocumentFormlink?documentID=" + documentID);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDocumentFormlink");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDocumentFormlink");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Linked forms with documents for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetActiveDocumentControls()
        {

            try
            {
                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Documents",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.GetAsync<List<DO_FormDocumentLink>>("DocumentControl/GetActiveDocumentControls");

                if (serviceResponse.Status)
                {
                    foreach (var fm in serviceResponse.Data)
                    {
                        jsObj = new jsTreeObject
                        {
                            id = fm.DocumentId.ToString(),
                            text = fm.DocumentName.ToString() + '.' + fm.FormName,
                            icon = baseURL + "/images/jsTree/openfolder.png",
                            parent = "FM"
                        };
                        treeView.Add(jsObj);
                    }
                    return Json(treeView);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveDocumentControls");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveDocumentControls");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Form Link with documents
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateDocumentFormlink(List<DO_FormDocumentLink> obj)
        {

            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    return true;
                });

                var serviceResponse = await _eSyaCalDocAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DocumentControl/UpdateDocumentFormlink", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateDocumentFormlink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        #endregion 
    }
}
