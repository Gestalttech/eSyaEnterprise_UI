using eSyaEnterprise_UI.ActionFilter;
using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Areas.ConfigureEmail.Data;
using eSyaEnterprise_UI.Areas.ConfigureEmail.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEnterprise_UI.Areas.ConfigureSMS.Data;

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
        public IActionResult EME_02_00()
        {
            return View();
        }
        #endregion
    }
}
