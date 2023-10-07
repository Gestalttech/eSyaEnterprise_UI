using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Admin.Data;
using eSyaEnterprise_UI.Areas.Admin.Models;
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
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Admin.Controllers
{
    [SessionTimeout]
    public class CountryAreaController : Controller
    {
        private readonly IeSyaAdminAPIServices _eSyaAdminAPIServices;
        private readonly ILogger<CountryAreaController> _logger;

        public CountryAreaController(IeSyaAdminAPIServices eSyaAdminAPIServices, ILogger<CountryAreaController> logger)
        {
            _eSyaAdminAPIServices = eSyaAdminAPIServices;
            _logger = logger;
        }
        #region Country Area
        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAD_01_00()
        {
            return View();
        }

        /// <summary>
        ///Get States by ISD Code for dropdown
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetActiveStatesbyISDCode(int isdCode)
        {

            try
            {
                var parameter = "?isdCode=" + isdCode;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_States>>("CountryArea/GetActiveStatesbyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveStatesbyISDCode");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveStatesbyISDCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }


        /// <summary>
        ///Get Cities by State Code for dropdown
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetActiveCitiesbyStateCode(int isdCode, int stateCode)
        {

            try
            {
                var parameter = "?isdCode=" + isdCode + "&stateCode=" + stateCode;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_Cities>>("CountryArea/GetActiveCitiesbyStateCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveCitiesbyStateCode");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveCitiesbyStateCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Address Area Header for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAddressAreaHeader(int isdCode, int stateCode, int cityCode)
        {

            try
            {
                var parameter = "?isdCode=" + isdCode + "&stateCode=" + stateCode + "&cityCode=" + cityCode;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_AddressHeader>>("CountryArea/GetAddressAreaHeader" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAddressAreaHeader");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAddressAreaHeader");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Address Area Header & Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateIntoZipAreaHeaderDetails(bool isInsert, DO_AddressHeader obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                if (isInsert)
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CountryArea/InsertIntoZipArea", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("CountryArea/UpdateIntoZipArea", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateIntoZipAreaHeaderDetails:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }



        /// <summary>
        ///Get Address Area Details for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAddressAreaDetails(int isdCode, int stateCode, int cityCode, string? zipCode)
        {

            try
            {
                
                var parameter = "?isdCode=" + isdCode + "&stateCode=" + stateCode + "&cityCode=" + cityCode + "&zipCode=" + zipCode;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_AddressDetails>>("CountryArea/GetAddressAreaDetails" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAddressAreaDetails");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAddressAreaDetails");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        #endregion CountryArea
    }
}
