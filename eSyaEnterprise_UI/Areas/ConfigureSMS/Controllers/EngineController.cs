using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigureSMS.Data;
using eSyaEnterprise_UI.Areas.ConfigureSMS.Models;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ConfigureSMS.Controllers
{
    [SessionTimeout]
    public class EngineController : Controller
    {
        private readonly IeSyaSMSAPIServices _eSyaSMSAPIServices;
        private readonly ILogger<EngineController> _logger;
        public EngineController(IeSyaSMSAPIServices eSyaSMSAPIServices, ILogger<EngineController> logger)
        {
            _eSyaSMSAPIServices = eSyaSMSAPIServices;
            _logger = logger;
        }

        #region SMS Configure

        [Area("ConfigureSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESE_01_00()
        {
            return View();
        }

        /// <summary>
        ///Get SMS Variable Information
        /// </summary>
        [HttpPost]
        public JsonResult GetSMSVariableInformation()
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSVariable>>("SMSEngine/GetSMSVariableInformation").Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into SMS Variable
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoSMSVariable(DO_SMSVariable sm_sv)
        {
            try
            {
                sm_sv.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sv.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sv.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/InsertIntoSMSVariable", sm_sv).Result;
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
        /// Update SMS Variable
        /// </summary>
        [HttpPost]
        public JsonResult UpdateSMSVariable(DO_SMSVariable sm_sv)
        {
            try
            {
                sm_sv.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sv.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sv.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/UpdateSMSVariable", sm_sv).Result;
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
        /// Activate or De Activate SMS Variable
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveSMSVariable(bool status, string smsvariable)
        {

            try
            {

                var parameter = "?status=" + status + "&smsvariable=" + smsvariable;
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SMSEngine/ActiveOrDeActiveSMSVariable" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveSMSVariable:For smsvariable {0} ", smsvariable);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region SMS Trigger Event
        [Area("ConfigureSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESE_02_00()
        {
            return View();
        }

        /// <summary>
        ///Get All SMS Trigger Events
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllSMSTriggerEvents()
        {
            try
            {
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSTEvent>>("SMSEngine/GetAllSMSTriggerEvents");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllSMSTriggerEvents");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllSMSTriggerEvents");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Insert Into SMS Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertIntoSMSTriggerEvent(DO_SMSTEvent obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/InsertIntoSMSTriggerEvent", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoSMSTriggerEvent:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update SMS Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateSMSTriggerEvent(DO_SMSTEvent obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/UpdateSMSTriggerEvent", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateSMSTriggerEvent:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Delete SMS Trigger Event by Trigger Event Id
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> DeleteSMSTriggerEvent(int TeventId)
        {
            try
            {
                var parameter = "?TeventId=" + TeventId;
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SMSEngine/DeleteSMSTriggerEvent" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSMSTriggerEvent:For TeventId {0}", TeventId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate SMS Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveSMSTriggerEvent(bool status, int TriggerEventId)
        {

            try
            {

                var parameter = "?status=" + status + "&TriggerEventId=" + TriggerEventId;
                var serviceResponse = await _eSyaSMSAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("SMSEngine/ActiveOrDeActiveSMSTriggerEvent" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveSMSTriggerEvent:For TriggerEventId {0} ", TriggerEventId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Trigger Event

        #region SMS Information
        [Area("ConfigureSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESE_03_00()
        {
            try
            {
                //var serviceResponse = _smsAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("ConfigMasterData/GetFormDetails").Result;
                //ViewBag.FormList = serviceResponse.Data.Select(b => new SelectListItem
                //{
                //    Value = b.FormID.ToString(),
                //    Text = b.FormName,
                //}).ToList();

                var serviceResponse_event = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSTEvent>>("SMSEngine/GetSMSTriggerEvent").Result;
                ViewBag.TEvent = serviceResponse_event.Data.Select(b => new SelectListItem
                {
                    Value = b.TEventID.ToString(),
                    Text = b.TEventDesc,
                }).ToList();

                return View();
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        /// <summary>
        ///Get All forms forms from Form Master
        /// </summary>
        [HttpPost]
        public JsonResult GetFormDetails(string rdvalue)
        {
            try
            {
                if (rdvalue == "NewForm")
                {
                    var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("ConfigMasterData/GetFormDetails").Result;
                    return Json(serviceResponse.Data);
                }
                else
                {
                    var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("SMSEngine/GetExistingFormsFromSMSHeader").Result;
                    return Json(serviceResponse.Data);
                }

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get SMS Header Information
        /// </summary>
        [HttpPost]
        public JsonResult GetSMSHeaderInformationByFormId(int formId)
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSHeader>>("SMSEngine/GetSMSHeaderInformationByFormId?formId=" + formId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get SMS Trigger Event
        /// </summary>
        [HttpPost]
        public JsonResult GetSMSTriggerEvent()
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSTEvent>>("SMSEngine/GetSMSTriggerEvent").Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get SMS Header Information by SMS Id
        /// </summary>
        public JsonResult GetSMSHeaderInformationBySMSId(string smsId)
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<DO_SMSHeader>("SMSEngine/GetSMSHeaderInformationBySMSId?smsId=" + smsId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Active SMS Variable Information
        /// </summary>
        [HttpPost]
        public JsonResult GetActiveSMSVariableInformation()
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSVariable>>("SMSEngine/GetActiveSMSVariableInformation").Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Insert Into SMS Header
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoSMSHeader(DO_SMSHeader sm_sh)
        {
            try
            {
                sm_sh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sh.Smsid = string.IsNullOrEmpty(sm_sh.Smsid) ? string.Empty : sm_sh.Smsid;

                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/InsertIntoSMSHeader", sm_sh).Result;
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
        public JsonResult UpdateSMSHeader(DO_SMSHeader sm_sh)
        {
            try
            {
                sm_sh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/UpdateSMSHeader", sm_sh).Result;
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

        #region SMS To Whom

        [Area("ConfigureSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESE_05_00()
        {
            try
            {
                var serviceFormResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("ConfigMasterData/GetFormDetails").Result;
                ViewBag.FormList = serviceFormResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.FormID.ToString(),
                    Text = b.FormName,
                }).ToList();

                var serviceBusinessResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey").Result;
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
        ///Get SMS Header Information by Form Id && Parameter Id
        /// </summary>
        public JsonResult GetSMSHeaderForRecipientByFormIdandParamId(int formId, int parameterId)
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSHeader>>("SMSEngine/GetSMSHeaderForRecipientByFormIdandParamId?formId=" + formId + "&parameterId=" + parameterId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get SMS Recipient Information by BusinessKey And SMSId
        /// </summary>
        public JsonResult GetSMSRecipientByBusinessKeyAndSMSId(int businessKey, string smsId)
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSRecipient>>("SMSEngine/GetSMSRecipientByBusinessKeyAndSMSId?businessKey=" + businessKey + "&smsId=" + smsId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into SMS Recipient
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoSMSRecipient(DO_SMSRecipient sm_sr)
        {
            try
            {
                sm_sr.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sr.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sr.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/InsertIntoSMSRecipient", sm_sr).Result;
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
        /// Update SMS Recipient
        /// </summary>
        [HttpPost]
        public JsonResult UpdateSMSRecipient(DO_SMSRecipient sm_sr)
        {
            try
            {
                sm_sr.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                sm_sr.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                sm_sr.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/UpdateSMSRecipient", sm_sr).Result;
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

        #region Manage SMS Location-wise
        [Area("ConfigureSMS")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ESE_04_00()
        {
            try
            {
                var serviceBusinessResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("ConfigMasterData/GetBusinessKey").Result;
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
        ///Get Form SMS Link
        /// </summary>
        public JsonResult GetFormForSMSlinking()
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

                var serviceResponse1 = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_Forms>>("ConfigMasterData/GetFormForSMSlinking").Result;
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
        ///Get SMS Information by BusinessKey And FormId
        /// </summary>
        public JsonResult GetSMSInformationFormLocationWise(int formId, int businessKey)
        {
            try
            {
                var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.GetAsync<List<DO_SMSHeader>>("SMSEngine/GetSMSInformationFormLocationWise?businessKey=" + businessKey + "&formId=" + formId).Result;
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update SMS Information Form Location Wise
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdateSMSInformationFLW(List<DO_BusinessFormSMSLink> l_obj)
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

                    var serviceResponse = _eSyaSMSAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SMSEngine/InsertOrUpdateSMSInformationFLW", l_obj).Result;
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                    {
                        _logger.LogError(serviceResponse.Message, "UD:InsertOrUpdateSMSInformationFormLocationWise:Params:" + JsonConvert.SerializeObject(l_obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSMSInformationFormLocationWise:Params:" + JsonConvert.SerializeObject(l_obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

    }
}
