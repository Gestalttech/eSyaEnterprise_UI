using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Egypt.Data;
using eSyaEnterprise_UI.Areas.Egypt.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Egypt.Controllers
{
    [SessionTimeout]
    public class ReceptionController : Controller
    {
        private readonly IEgyptTokenSystemAPIServices _EgyptAdminAPIServices;
        private readonly ILogger<ReceptionController> _logger;

        public ReceptionController(IEgyptTokenSystemAPIServices EgyptAdminAPIServices, ILogger<ReceptionController> logger)
        {
            _EgyptAdminAPIServices = EgyptAdminAPIServices;
            _logger = logger;
        }
        #region Main screen calling
        [Area("Egypt")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult>  TKM_99_00()
        {
            List<string> l_RoomList = new List<string>();
            l_RoomList.Add("1");
            l_RoomList.Add("2");
            l_RoomList.Add("3");
            l_RoomList.Add("4");
            ViewBag.RoomList = l_RoomList;
            var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Reception/GetLoungNumbers");
            if (serviceResponse.Status)
            {
                ViewBag.LoungNumbers = serviceResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.ApplicationCode.ToString(),
                    Text = b.CodeDesc,
                }).ToList();

                return View();
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetFloors");
                return View();
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetDeskNumbers(int loungnumber)
        {
            try
            {
                var param = "?loungnumber=" + loungnumber;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Reception/GetDeskNumbers" + param);
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetTokenDetailForReceptionDesk(int tokenarea)
        {
            try
            {
                var param = "?businessKey=" + 11 + "&tokenarea=" + tokenarea;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_Reception>>("Reception/GetTokenDetailForReceptionDesk" + param);
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetLongWaitingPatients(int tokenarea)
        {
            try
            {
                var param = "?businessKey=" + 11 + "&tokenarea=" + tokenarea ;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.GetAsync<List<DO_Reception>>("Reception/GetLongWaitingPatients" + param);
                return Json(serviceResponse.Data);
            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateReceptionCallingToken(DO_Reception obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                //obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.BusinessKey = 11;

                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Reception/UpdateReceptionCallingToken", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateReceptionCallingToken:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateReceptionCallingToken:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateReceptionTokenToHold(DO_Reception obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                //obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.BusinessKey = 11;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Reception/UpdateReceptionTokenToHold", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateReceptionTokenToHold:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateReceptionTokenToHold:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<JsonResult> UpdateReceptionTokenToRelease(DO_Reception obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                //obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.BusinessKey = 11;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Reception/UpdateReceptionTokenToRelease", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateReceptionTokenToRelease:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateReceptionTokenToRelease:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateReceptionTokenStatusToCompleted(DO_Reception obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                //obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.BusinessKey = 11;
                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Reception/UpdateReceptionTokenStatusToCompleted", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateReceptionTokenStatusToCompleted:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateReceptionTokenStatusToCompleted:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region Next Buttons related functionality
        [HttpPost]
        public async Task<JsonResult> UpdateReceptionToCallingNextToken(DO_Reception obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.BusinessKey = 11;

                var serviceResponse = await _EgyptAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Reception/UpdateReceptionToCallingNextToken", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateReceptionToCallingNextToken:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateReceptionToCallingNextToken:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        #endregion

        #region Display
        [Area("Egypt")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult TKM_99_01()
        {
            return View();
        }

        #endregion
    }
}
