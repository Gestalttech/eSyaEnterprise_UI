﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManageInventory.Data;
using eSyaEnterprise_UI.Areas.ManageInventory.Models;
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

namespace eSyaEnterprise_UI.Areas.ManageInventory.Controllers
{
    [SessionTimeout]
    public class RulesController : Controller
    {
        private readonly IeSyaInventoryAPIServices _eSyaInventoryAPIServices;
        private readonly ILogger<RulesController> _logger;
        public RulesController(IeSyaInventoryAPIServices eSyaInventoryAPIServices, ILogger<RulesController> logger)
        {
            _eSyaInventoryAPIServices = eSyaInventoryAPIServices;
            _logger = logger;
        }

        #region Unit of Measure
        //Unit of Measure
        [Area("ManageInventory")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAD_06_00()
        {
            return View();
        }

        /// <summary>
        /// Getting Unit Measure List for Grid
        /// </summary>
        [Area("ManageInventory")]
        [HttpPost]
        public async Task<JsonResult> GetUnitofMeasurements()
        {
            try
            {
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<List<DO_UnitofMeasure>>("InventoryRules/GetUnitofMeasurements");
                if (serviceResponse.Status)
                {

                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUnitofMeasurements");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUnitofMeasurements");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Unite of Measure
        /// </summary>
        [Area("ManageInventory")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUnitofMeasurement(DO_UnitofMeasure uoms)
        {

            try
            {
                uoms.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                uoms.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                uoms.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("InventoryRules/InsertOrUpdateUnitofMeasurement", uoms);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoCurrencyMaster:params:" + JsonConvert.SerializeObject(uoms));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        /// <summary>
        ///Get Unit of Measure Purchase description by UOMP Code
        /// </summary>
        [Area("ManageInventory")]
        [HttpPost]
        public async Task<JsonResult> GetUOMPDescriptionbyUOMP(string uomp)
        {
            try
            {
                var parameter = "?uomp=" + uomp;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<DO_UnitofMeasure>("InventoryRules/GetUOMPDescriptionbyUOMP" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUOMPDescriptionbyUOMP:For uomp {0}", uomp);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUOMPDescriptionbyUOMP:For uomp {0}", uomp);
                throw ex;
            }
        }

        /// <summary>
        ///Get Unit of Measure Stock description by UOMS Code
        /// </summary>
        [Area("ManageInventory")]
        [HttpPost]
        public async Task<JsonResult> GetUOMSDescriptionbyUOMS(string uoms)
        {
            try
            {
                var parameter = "?uoms=" + uoms;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<DO_UnitofMeasure>("InventoryRules/GetUOMSDescriptionbyUOMS" + parameter);

                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUOMSDescriptionbyUOMS:For uoms {0}", uoms);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUOMSDescriptionbyUOMS:For uoms {0}", uoms);
                throw ex;
            }
        }
        /// <summary>
        /// Activate or De Activate Unit of Measure
        /// </summary>
        [Area("ManageInventory")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveUnitofMeasure(bool status, int unitId)
        {

            try
            {

                var parameter = "?status=" + status + "&unitId=" + unitId;
                var serviceResponse = await _eSyaInventoryAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("InventoryRules/ActiveOrDeActiveUnitofMeasure" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveUnitofMeasure:For unitId {0} ", unitId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Unit of Measure
    }

}