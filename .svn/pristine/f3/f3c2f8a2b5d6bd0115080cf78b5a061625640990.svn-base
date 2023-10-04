using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Localize.Data;
using eSyaEnterprise_UI.Areas.Localize.Models;
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

namespace eSyaEnterprise_UI.Areas.Localize.Controllers
{
    [SessionTimeout]
    public class ControllerController : Controller
    {
        private readonly IeSyaLocalizeAPIServices _eSyalocalizeAPIServices;
        private readonly ILogger<ControllerController> _logger;

        public ControllerController(IeSyaLocalizeAPIServices eSyalocalizeAPIServices, ILogger<ControllerController> logger)
        {
            _eSyalocalizeAPIServices = eSyalocalizeAPIServices;
            _logger = logger;
        }

        #region Language Controller
        [Area("Localize")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ELE_03_00()
        {
            try
            {
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<string>>("Controller/GetAllControllers");

                if (serviceResponse.Status)
                {
                    ViewBag.Controllers = serviceResponse.Data;
                    return View();

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllControllers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllControllers");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Language Controllers Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLanguageControllersbyResource(string Resource)
        {
            try
            {
                if (!string.IsNullOrEmpty(Resource))
                {
                    var parameter = "?Resource=" + Resource;
                    var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LanguageController>>("Controller/GetLanguageControllersbyResource" + parameter);
                    return Json(serviceResponse.Data);
                }
                else
                    return Json(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLanguageControllersbyResource:For Resource", Resource);

                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Localization Language Controller
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateLanguageController(DO_LanguageController lobj)
        {

            try
            {
                lobj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                lobj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                lobj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Controller/InsertOrUpdateLanguageController", lobj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertMenukeysIntoUserGroup:params:" + JsonConvert.SerializeObject(lobj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }


        /// <summary>
        /// Activate or De Activate Localization Language Controller
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveLanguageController(bool status, int ResourceId)
        {

            try
            {

                var parameter = "?status=" + status + "&ResourceId=" + ResourceId;
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Controller/ActiveOrDeActiveLanguageController" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveLanguageController:For ResourceId {0} ", ResourceId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
