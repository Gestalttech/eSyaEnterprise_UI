﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class NotificationController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<NotificationController> _logger;
        public NotificationController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<NotificationController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }
        #region Notification Trigger Event
        /// <summary>
        /// Notification Trigger Event
        /// </summary>
        /// <returns></returns>
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_22_00()
        {
            return View();
        }


        /// <summary>
        ///Get All Notification Trigger Events
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllSMSTriggerEvents()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_SMSTEvent>>("Notification/GetAllSMSTriggerEvents");
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
        /// Insert Into Notification Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertIntoSMSTriggerEvent(DO_SMSTEvent obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Notification/InsertIntoSMSTriggerEvent", obj);
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
        /// Update Notification Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateSMSTriggerEvent(DO_SMSTEvent obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Notification/UpdateSMSTriggerEvent", obj);
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
        ///Delete Notification Trigger Event by Trigger Event Id
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> DeleteSMSTriggerEvent(int TeventId)
        {
            try
            {
                var parameter = "?TeventId=" + TeventId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Notification/DeleteSMSTriggerEvent" + parameter);
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
        /// Activate or De Activate Notification Trigger Event
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveSMSTriggerEvent(bool status, int TriggerEventId)
        {

            try
            {

                var parameter = "?status=" + status + "&TriggerEventId=" + TriggerEventId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Notification/ActiveOrDeActiveSMSTriggerEvent" + parameter);
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
    }
}