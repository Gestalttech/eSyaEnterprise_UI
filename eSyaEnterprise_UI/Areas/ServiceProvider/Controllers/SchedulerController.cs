using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ServiceProvider.Data;
using eSyaEnterprise_UI.Areas.ServiceProvider.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using System.Reflection.Emit;

namespace eSyaEnterprise_UI.Areas.ServiceProvider.Controllers
{
    [SessionTimeout]
    public class SchedulerController : Controller
    {
        private readonly IeSyaServiceProviderAPIServices _eSyaServiceProviderAPIServices;
        private readonly ILogger<SchedulerController> _logger;
        public SchedulerController(IeSyaServiceProviderAPIServices eSyaServiceProviderAPIServices, ILogger<SchedulerController> logger)
        {
            _eSyaServiceProviderAPIServices = eSyaServiceProviderAPIServices;
            _logger = logger;
        }
        #region Doctor Scheduler
        [Area("ServiceProvider")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ESP_03_00()
        {
            try
            {
                var serviceresponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
                if (serviceresponse.Status)
                {
                    ViewBag.BusinessKeys= serviceresponse.Data.Select(a => new SelectListItem
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
        public async Task<JsonResult> GetSpecialtiesbyDoctorID(int Businesskey, int DoctorID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey+ "&DoctorID="+ DoctorID;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyDoctorLink>>("Scheduler/GetSpecialtiesbyDoctorID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSpecialtiesbyDoctorID:For DoctorID {0} ", DoctorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtiesbyDoctorID:For DoctorID {0} ", DoctorID);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetClinicsbySpecialtyID(int Businesskey, int DoctorID, int SpecialtyID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorClinic>>("Scheduler/GetClinicsbySpecialtyID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetClinicsbySpecialtyID:For SpecialtyID {0} ", SpecialtyID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetClinicsbySpecialtyID:For SpecialtyID {0} ", SpecialtyID);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetConsultationsbyClinicID(int Businesskey, int DoctorID, int SpecialtyID, int ClinicID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID + "&ClinicID=" + ClinicID;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorClinic>>("Scheduler/GetConsultationsbyClinicID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetConsultationsbyClinicID:For ClinicID {0} ", ClinicID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetConsultationsbyClinicID:For ClinicID {0} ", ClinicID);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetDoctorScheduleList(int Businesskey, int DoctorID, int SpecialtyID, int ClinicID, int ConsultationID)
        {
            try
            {
                var parameter = "?Businesskey=" + Businesskey + "&DoctorID=" + DoctorID + "&SpecialtyID=" + SpecialtyID + "&ClinicID=" + ClinicID+ "&ConsultationID="+ ConsultationID;
                var serviceResponse = await _eSyaServiceProviderAPIServices.HttpClientServices.GetAsync<List<DO_DoctorScheduler>>("Scheduler/GetDoctorScheduleList" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDoctorScheduleList:For ConsultationID {0} ", ConsultationID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDoctorScheduleList:For ConsultationID {0} ", ConsultationID);
                throw ex;
            }
        }
        /// <summary>
        /// Insert Doctor Schedule
        /// </summary>
        [HttpPost]
        public JsonResult InsertIntoDoctorSchedule(DO_DoctorScheduler obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Scheduler/InsertIntoDoctorSchedule", obj).Result;
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

        /// <summary>
        /// Update Doctor Schedule
        /// </summary>
        [HttpPost]
        public JsonResult UpdateDoctorSchedule(DO_DoctorScheduler obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Scheduler/UpdateDoctorSchedule", obj).Result;
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
        /// <summary>
        /// Update Doctor Schedule
        /// </summary>
        [HttpPost]
        public JsonResult ActivateOrDeActivateDoctorSchedule(DO_DoctorScheduler obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var Insertresponse = _eSyaServiceProviderAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Scheduler/ActivateOrDeActivateDoctorSchedule", obj).Result;
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
        #endregion
    }
}
