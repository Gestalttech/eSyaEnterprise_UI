using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
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
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class ApplicationCodesController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<ApplicationCodesController> _logger;
        public ApplicationCodesController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<ApplicationCodesController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }

        #region Code Type
        /// <summary>
        /// Code Type
        /// </summary>
        /// <returns></returns>
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_04_00()
        {
            return View();
        }

        /// <summary>
        ///Get Code Types for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCodeTypes()
        {

            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CodeTypes>>("ApplicationCodes/GetCodeTypes");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCodeTypes");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCodeTypes");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Code Types
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateCodeTypes(bool isInsert, DO_CodeTypes ct_type)
        {

            try
            {
                ct_type.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                ct_type.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                ct_type.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/InsertIntoCodeType", ct_type);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/UpdateCodeType", ct_type);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateCodeTypes:params:" + JsonConvert.SerializeObject(ct_type));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Code Types
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveCodeTypes(bool status, int code_type)
        {

            try
            {

                var parameter = "?status=" + status + "&code_type=" + code_type;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ApplicationCodes/ActiveOrDeActiveCodeTypes" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveCodeTypes:For codeType {0} ", code_type);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion



        #region Application Codes -System defined
        /// <summary>
        /// Application Codes
        /// </summary>
        /// <returns></returns>
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_05_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CodeTypes>>("ApplicationCodes/GetActiveCodeTypes");
                if (serviceResponse.Status)
                {
                    ViewBag.CodeTypeList = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.CodeType.ToString(),
                        Text = b.CodeTypeDesc,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:ActiveCodeTypes");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveCodeTypes");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get Application Codes by code Type for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetApplicationCodesByCodeType(int codeType)
        {

            try
            {
                var parameter = "?codeType=" + codeType;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ApplicationCodes/GetApplicationCodesByCodeType" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApplicationCodesByCodeType:For codeType {0}", codeType);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType:For codeType {0} ", codeType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        /// Insert or Update Application Codes 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateApplicationCodes(DO_ApplicationCodes app_codes)
        {

            try
            {
                app_codes.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                app_codes.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                app_codes.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (app_codes.ApplicationCode == 0)
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/InsertIntoApplicationCodes", app_codes);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/UpdateApplicationCodes", app_codes);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateApplicationCodes:params:" + JsonConvert.SerializeObject(app_codes));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Application Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveApplicationCode(bool status, int app_code)
        {

            try
            {

                var parameter = "?status=" + status + "&app_code=" + app_code;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ApplicationCodes/ActiveOrDeActiveApplicationCode" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveApplicationCode:For codeType {0} ", app_code);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        #endregion
    }
}
