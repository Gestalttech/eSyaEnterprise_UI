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
    }
}
