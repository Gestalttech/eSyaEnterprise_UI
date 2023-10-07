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
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Admin.Controllers
{
    [SessionTimeout]
    public class ApplicationCodesController : Controller
    {
        private readonly IeSyaAdminAPIServices _eSyaAdminAPIServices;
        private readonly ILogger<ApplicationCodesController> _logger;

        public ApplicationCodesController(IeSyaAdminAPIServices eSyaAdminAPIServices, ILogger<ApplicationCodesController> logger)
        {
            _eSyaAdminAPIServices = eSyaAdminAPIServices;
            _logger = logger;
        }

        #region Application codes-User defined

        /// <summary>
        /// Application Codes
        /// </summary>
        /// <returns></returns>

        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAD_02_00()
        {
            try
            {
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_CodeTypes>>("ApplicationCodes/GetUserDefinedCodeTypesList");
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
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUserDefinedCodeTypesList");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUserDefinedCodeTypesList");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Application Codes by code Type for Grid
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> GetApplicationCodesByCodeType(int codeType)
        {

            try
            {
                var parameter = "?codeType=" + codeType;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ApplicationCodes/GetApplicationCodesByCodeType" + parameter);
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
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> InsertOrAudateApplicationCodes(DO_ApplicationCodes app_codes)
        {

            try
            {
                app_codes.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                app_codes.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                app_codes.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (app_codes.ApplicationCode == 0)
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/InsertIntoApplicationCodes", app_codes);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/UpdateApplicationCodes", app_codes);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrAudateApplicationCodes:params:" + JsonConvert.SerializeObject(app_codes));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Application Codes
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveApplicationCode(bool status, int app_code)
        {

            try
            {

                var parameter = "?status=" + status + "&app_code=" + app_code;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("ApplicationCodes/ActiveOrDeActiveApplicationCode" + parameter);
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
