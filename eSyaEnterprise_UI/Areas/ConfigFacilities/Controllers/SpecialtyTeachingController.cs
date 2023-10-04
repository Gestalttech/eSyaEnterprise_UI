using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFacilities.Data;
using eSyaEnterprise_UI.Areas.ConfigFacilities.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static eSyaEnterprise_UI.Areas.ConfigFacilities.Models.DO_CommonData;

namespace eSyaEnterprise_UI.Areas.ConfigFacilities.Controllers
{
    [SessionTimeout]
    public class SpecialtyTeachingController : Controller
    {
        private readonly IeSyaFacilityAPIServices _eSyafacilityAPIServices;
        private readonly ILogger<SpecialtyTeachingController> _logger;

        public SpecialtyTeachingController(IeSyaFacilityAPIServices eSyafacilityAPIServices, ILogger<SpecialtyTeachingController> logger)
        {
            _eSyafacilityAPIServices = eSyafacilityAPIServices;
            _logger = logger;
        }

        #region Specialty Units
        [Area("Facilities")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECP_06_00()
        {
            var serviceResponse = await _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceResponse.Status)
            {
                if (serviceResponse.Data != null)
                {
                    ViewBag.BusinessKey = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.BusinessKey.ToString(),
                        Text = b.LocationDescription,
                    }).ToList();
                }
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:V_1581_00:GetBusinessKey");
            }
            return View();
        }



        /// <summary>
        /// Get Specialty By BusinessKey
        /// </summary>
        [HttpGet]
        public JsonResult GetSpecialtyListByBusinessKey(int businessKey)
        {
            try
            {
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyUnit>>("SpecialtyUnits/GetSpecialtyListByBusinessKey?businessKey=" + businessKey).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetSpecialtyListByBusinessKey:For businessKey {0}", businessKey);
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyListByBusinessKey:For businessKey {0}", businessKey);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Units Validity Detail
        /// </summary>
        [HttpGet]
        public JsonResult GetUnitsValidityBySpecialty(int businessKey, int specialtyId)
        {
            try
            {
                var param = "?businessKey=" + businessKey;
                param += "&specialtyId=" + specialtyId;
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<List<DO_SpecialtyUnit>>("SpecialtyUnits/GetUnitsValidityBySpecialty" + param).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetUnitsValidityBySpecialty:For businessKey {0} , specialtyId {1}", businessKey, specialtyId);
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUnitsValidityBySpecialty:For businessKey {0} , specialtyId {1}", businessKey, specialtyId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        [HttpPost]
        public async Task<JsonResult> InsertSpecialtyUnitsValidity(DO_SpecialtyUnit obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.ActiveStatus = true;
                obj.FormId = "V_1581_00";

                var serviceResponse = await _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyUnits/InsertSpecialtyUnitsValidity", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertSpecialtyUnitsValidity:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertSpecialtyUnitsValidity:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSpecialtyUnitsValidity:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpGet]
        public JsonResult GetSpecialtyIPInfo(int businessKey, int specialtyId)
        {
            try
            {
                var param = "?businessKey=" + businessKey;
                param += "&specialtyId=" + specialtyId;
                var response = _eSyafacilityAPIServices.HttpClientServices.GetAsync<DO_SpecialtyUnit>("SpecialtyUnits/GetSpecialtyIPInfo" + param).Result;
                if (response.Status)
                {
                    return Json(response.Data);
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetSpecialtyIPInfo:For businessKey {0} , specialtyId {1}", businessKey, specialtyId);
                    return Json(new DO_ReturnParameter()
                    {
                        Status = false,
                        StatusCode = response.StatusCode.ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSpecialtyIPInfo:For businessKey {0} , specialtyId {1}", businessKey, specialtyId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        [HttpPost]
        public async Task<JsonResult> AddOrUpdateSpecialtyIPInfo(DO_SpecialtyUnit obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.ActiveStatus = true;
                obj.FormId = "V_1581_00";

                var serviceResponse = await _eSyafacilityAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SpecialtyUnits/AddOrUpdateSpecialtyIPInfo", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:AddOrUpdateSpecialtyIPInfo:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateSpecialtyIPInfo:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateSpecialtyIPInfo:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
