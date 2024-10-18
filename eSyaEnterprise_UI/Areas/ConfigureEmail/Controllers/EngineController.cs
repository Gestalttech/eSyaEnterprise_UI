using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Areas.ConfigureEmail.Data;
using eSyaEnterprise_UI.Areas.ConfigureEmail.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ManageRates.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEssentials_UI;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigureEmail.Controllers
{
    [SessionTimeout]
    public class EngineController : Controller
    {
        private readonly IeSyaEmailAPIServices _eSyaEmailAPIServices;
        private readonly ILogger<EngineController> _logger;
        public EngineController(IeSyaEmailAPIServices eSyaEmailAPIServices, ILogger<EngineController> logger)
        {
            _eSyaEmailAPIServices = eSyaEmailAPIServices;
            _logger = logger;
        }

        #region Define Email Variable Component
        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EME_01_00()
        {
            return View();
        }

        /// <summary>
        ///Get Email Variable Information
        /// </summary>
        [HttpPost]
        public JsonResult GetEmailVariableInformation()
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailVariable>>("EmailEngine/GetEmailVariableInformation").Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into Email Variable
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoEmailVariable(DO_EmailVariable obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/InsertIntoEmailVariable", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Update Email Variable
        /// </summary>
        [HttpPost]
        public JsonResult UpdateEmailVariable(DO_EmailVariable obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/UpdateEmailVariable", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        /// <summary>
        /// Activate or De Activate Email Variable
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveEmailVariable(bool status, string Emavariable)
        {
            try
            {
                var parameter = "?status=" + status + "&smsvariable=" + Emavariable;
                
                var serviceResponse = await _eSyaEmailAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SMSEngine/ActiveOrDeActiveEmailVariable" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveEmailVariable:For smsvariable {0} ", Emavariable);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Define Email Template
        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EME_02_00()
        {
            try
            {
                var serviceResponse = await _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCode>>("CommonData/GetApplicationCodesByCodeType?codetype=" + ApplicationCodeTypeValues.EMailType);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        ViewBag.EmailType_list = serviceResponse.Data.Select(r => new SelectListItem
                        {
                            Value = r.ApplicationCode.ToString(),
                            Text = r.CodeDesc,
                        }).ToList();
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApplicationCodesByCodeType: CodeType {0} ", ApplicationCodeTypeValues.EMailType);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType: CodeType {0} ", ApplicationCodeTypeValues.EMailType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
            return View();
        }

        /// <summary>
        ///Get All forms forms from Form Master
        /// </summary>
        /// 
        [Area("ConfigureEmail")]
        [HttpPost]

        public JsonResult GetFormDetails(string rdvalue)
        {
            try
            {
                if (rdvalue == "NewForm")
                {
                    var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("CommonData/GetFormDetails").Result;
                    return Json(serviceResponse.Data);
                }
                else
                {
                    var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("EmailEngine/GetExistingFormsFromEmailHeader").Result;
                    return Json(serviceResponse.Data);
                }

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Email Header Information
        /// </summary>
        [HttpPost]
        public JsonResult GetEmailHeaderInformationByFormId(int formId)
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailHeader>>("EmailEngine/GetEmailHeaderInformationByFormId?formId=" + formId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get SMS Header Information by Email Temp Id
        /// </summary>
        public JsonResult GetEmailHeaderInformationByEmailId(string emailTempId)
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<DO_EmailHeader>("EmailEngine/GetEmailHeaderInformationByEmailId?emailTempId=" + emailTempId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Active Email Variable Information
        /// </summary>
        [HttpPost]
        public JsonResult GetActiveEmailVariableInformation()
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailVariable>>("EmailEngine/GetActiveEmailVariableInformation").Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Insert Into Email Template Header
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoEmailHeader(DO_EmailHeader sm_sh)
        {
            try
            {
                sm_sh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sh.EmailTempid = string.IsNullOrEmpty(sm_sh.EmailTempid) ? string.Empty : sm_sh.EmailTempid;

                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/InsertIntoEmailHeader", sm_sh).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Update SMS Header
        /// </summary>
        [HttpPost]
        public JsonResult UpdateEmailHeader(DO_EmailHeader sm_sh)
        {
            try
            {
                sm_sh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/UpdateEmailHeader", sm_sh).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region Manage Email Location-wise
        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EME_03_00()
        {
            try
            {
                var serviceBusinessResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKeyByEmailIntegration").Result;
                ViewBag.BusinessKey = serviceBusinessResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.BusinessKey.ToString(),
                    Text = b.LocationDescription,
                }).ToList();

                return View();
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        ///Get Form Email Link
        /// </summary>
        public JsonResult GetFormForEmaillinking()
        {
            try
            {
                List<jsTreeObject> treeView = new List<jsTreeObject>();

                string baseURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";

                jsTreeObject jsObj = new jsTreeObject
                {
                    id = "FM",
                    parent = "#",
                    text = "eSya Forms",
                    icon = baseURL + "/images/jsTree/foldergroupicon.png",
                    state = new stateObject { opened = true, selected = false }
                };
                treeView.Add(jsObj);

                var serviceResponse1 = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("CommonData/GetFormDetails").Result;
                if (serviceResponse1.Status)
                {
                    foreach (var fm in serviceResponse1.Data)
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
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse1.Message), "UD:GetFormList");
                }

                return Json(treeView);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetFormList");
                throw ex;
            }
        }

        /// <summary>
        ///Get Email Information by BusinessKey And FormId
        /// </summary>
        public JsonResult GetEmailInformationFormLocationWise(int formId, int businessKey)
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailHeader>>("EmailEngine/GetEmailInformationFormLocationWise?businessKey=" + businessKey + "&formId=" + formId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Email Information Form Location Wise
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdateEmailInformationFLW(List<DO_BusinessFormEmailLink> l_obj)
        {
            try
            {
                if (l_obj.Count == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "No Record" });
                }
                else
                {
                    l_obj.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormId1 = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });

                    var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/InsertOrUpdateEmailInformationFLW", l_obj).Result;
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(serviceResponse.Message, "UD:InsertOrUpdateEmailInformationFormLocationWise:Params:" + JsonConvert.SerializeObject(l_obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateEmailInformationFormLocationWise:Params:" + JsonConvert.SerializeObject(l_obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Email To Whom

        [Area("ConfigureEmail")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EME_04_00()
        {
            try
            {
                var serviceFormResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("CommonData/GetFormDetails").Result;
                ViewBag.FormList = serviceFormResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.FormID.ToString(),
                    Text = b.FormName,
                }).ToList();

                var serviceBusinessResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey").Result;
                ViewBag.BusinessLocationList = serviceBusinessResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.BusinessKey.ToString(),
                    Text = b.LocationDescription,
                }).ToList();

                return View();
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        ///Get Email Header Information by Form Id && Parameter Id
        /// </summary>
        public JsonResult GetEmailHeaderForRecipientByFormIdandParamId(int formId, int parameterId)
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailHeader>>("EmailEngine/GetEmailHeaderForRecipientByFormIdandParamId?formId=" + formId + "&parameterId=" + parameterId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Email Recipient Information by BusinessKey And SMSId
        /// </summary>
        public JsonResult GetEmailRecipientByBusinessKeyAndEmailTempId(int businessKey, string emailTempId)
        {
            try
            {
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.GetAsync<List<DO_EmailRecipient>>("EmailEngine/GetEmailRecipientByBusinessKeyAndEmailTempId?businessKey=" + businessKey + "&emailTempId=" + emailTempId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into Email Recipient
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoEmailRecipient(DO_EmailRecipient obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId1 = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/InsertIntoEmailRecipient", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        /// Update Email Recipient
        /// </summary>
        [HttpPost]
        public JsonResult UpdateEmailRecipient(DO_EmailRecipient obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId1 = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaEmailAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("EmailEngine/UpdateEmailRecipient", obj).Result;
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }


        #endregion
    }
}
