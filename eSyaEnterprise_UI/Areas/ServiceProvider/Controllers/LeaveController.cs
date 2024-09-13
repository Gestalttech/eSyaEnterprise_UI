using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ServiceProvider.Data;
using eSyaEnterprise_UI.Areas.ServiceProvider.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Controllers
{
    [SessionTimeout]
    public class LeaveController : Controller
    {
        private readonly IeSyaServiceProviderAPIServices _eSyaServiceProviderAPIServices;
        private readonly ILogger<LeaveController> _logger;
        public LeaveController(IeSyaServiceProviderAPIServices eSyaServiceProviderAPIServices, ILogger<LeaveController> logger)
        {
            _eSyaServiceProviderAPIServices = eSyaServiceProviderAPIServices;
            _logger = logger;
        }

        #region Doctor Leave
        [Area("ServiceProvider")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ESP_02_00()
        {
            try
            {
                var serviceresponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                if (serviceresponse.Status)
                {
                    ViewBag.BusinessKeys = serviceresponse.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceresponse.Message), "UD:GetApplicationCodesByCodeType:For DoctorClass {0}", ApplicationCodeTypeValues.DoctorClass);
                }
                return View();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For DoctorClass {0}", ApplicationCodeTypeValues.DoctorClass);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetDoctorsbyBusinessKey(int Businesskey)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorMaster>>("Scheduler/GetDoctorsbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorsbyBusinessKey:For Businesskey {0} ", Businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorsbyBusinessKey:For Businesskey {0} ", Businesskey);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetDoctorLeaveListAll(int Businesskey, int DoctorID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey+ "&DoctorID="+ DoctorID;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorLeave>>("DoctorLeave/GetDoctorLeaveListAll" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorLeaveListAll:For DoctorID {0} ", DoctorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorLeaveListAll:For DoctorID {0} ", DoctorID);
                throw ex;
            }
        }
        /// <summary>
        /// Insert Or Update Doctor Leave
        /// </summary>
        [HttpPost]
        public JsonResult InsertOrUpdateIntoDoctorSchedule(bool isInsert, DO_DoctorLeave obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var Insertresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorLeave/InsertIntoDoctorLeave", obj).Result;
                    if (Insertresponse.Status)
                    {
                        return Json(Insertresponse.Data);
                    }
                    else
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                    }
                }
                else
                {
                    var Updateresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorLeave/UpdateDoctorLeave", obj).Result;
                    if (Updateresponse.Status)
                    {
                        return Json(Updateresponse.Data);
                    }
                    else
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = Updateresponse.Message });
                    }
                }
               

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Update Doctor Schedule
        /// </summary>
        [HttpPost]
        public JsonResult ActivateOrDeActivateDoctorLeave(DO_DoctorLeave obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DoctorLeave/ActivateOrDeActivateDoctorLeave", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion region
    }
}
