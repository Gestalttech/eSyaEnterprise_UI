﻿using Microsoft.AspNetCore.Mvc;
using eSyaEnterprise_UI.Areas.ConfigPharma.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using eSyaEnterprise_UI.Areas.ConfigPharma.Models;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using System.Reflection.Emit;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;

namespace eSyaEnterprise_UI.Areas.ConfigPharma.Controllers
{
    [SessionTimeout]
    public class DrugClassController : Controller
    {
        private readonly IeSyaConfigPharmaAPIServices _eSyapharmaAPIServices;
        private readonly ILogger<DrugClassController> _logger;

        public DrugClassController(IeSyaConfigPharmaAPIServices pharmacyAPIServices, ILogger<DrugClassController> logger)
        {
            _eSyapharmaAPIServices = pharmacyAPIServices;
            _logger = logger;
        }
       
        #region Drug Class

        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPH_02_00()
        {
            return View();
        }
       
        /// <summary>
        ///Get Get All Drug Class for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllDrugClass()
        {

            try
            {
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugClass>>("DrugClass/GetAllDrugClass");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllDrugClass");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllDrugClass");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Drug Class
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDrugClass(bool isInsert, DO_DrugClass obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID= AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugClass/InsertIntoDrugClass", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugClass/UpdateIntoDrugClass", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDrugClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Drug Class
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDrugClass(bool status, int drugclassId)
        {

            try
            {

                var parameter = "?status=" + status + "&drugclassId=" + drugclassId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DrugClass/ActiveOrDeActiveDrugClass" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDrugClass:For drugclassId {0} ", drugclassId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
      
        #region Therapeutic Class

        [Area("ConfigPharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPH_03_00()
        {
            return View();
        }

        /// <summary>
        ///Get Get AllDrug Therapeutic for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllDrugTherapeutics()
        {

            try
            {
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugTherapeutic>>("DrugClass/GetAllDrugTherapeutics");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllDrugTherapeutics");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllDrugTherapeutics");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Drug Therapeutic
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDrugTherapeutic(bool isInsert, DO_DrugTherapeutic obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugClass/InsertIntoDrugTherapeutic", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugClass/UpdateDrugTherapeutic", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDrugTherapeutic:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Drug Therapeutic
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDrugTherapeutic(bool status, int drugthrapId)
        {

            try
            {

                var parameter = "?status=" + status + "&drugthrapId=" + drugthrapId;
                var serviceResponse = await _eSyapharmaAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("DrugClass/ActiveOrDeActiveDrugTherapeutic" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDrugTherapeutic:For drugthrapId {0} ", drugthrapId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
       
    }
}
