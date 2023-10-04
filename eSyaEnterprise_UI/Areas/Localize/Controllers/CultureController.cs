using ClosedXML.Excel;
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
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.Localize.Controllers
{
    [SessionTimeout]
    public class CultureController : Controller
    {
        private readonly IeSyaLocalizeAPIServices _eSyalocalizeAPIServices;
        private readonly ILogger<CultureController> _logger;

        public CultureController(IeSyaLocalizeAPIServices eSyalocalizeAPIServices, ILogger<CultureController> logger)
        {
            _eSyalocalizeAPIServices = eSyalocalizeAPIServices;
            _logger = logger;
        }
        #region Language Culture
        [Area("Localize")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ELE_04_00()
        {
            try
            {

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LanguageController>>("Culture/GetResources");
                if (serviceResponse.Status)
                {
                    ViewBag.Resources = serviceResponse.Data;
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetResources");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetResources");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Language Culture Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLanguageCulture(string Culture, string Resource)
        {
            try
            {

                var parameter = "?Resource=" + Resource + "&Culture=" + Culture;
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LanguageCulture>>("Culture/GetLanguageCulture" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLanguageCulture:For Culture {0} with Resource entered {1}", Culture, Resource);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLanguageCulture:For Culture {0} with Resource entered {1}", Culture, Resource);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Resource Culture
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateLanguageCulture(List<DO_LanguageCulture> obj)
        {

            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Culture/InsertOrUpdateLanguageCulture", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateLanguageCulture:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion


        #region Culture Keys
        [Area("Localize")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult ELE_05_00()
        {

            return View();
        }
        /// <summary>
        /// Get Language Culturekeys for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDistinictCultureKeys(string Culture)
        {
            try
            {

                var parameter = "?Culture=" + Culture;
                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LanguageCulture>>("Culture/GetDistinictCultureKeys" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDistinictCultureKeys:For Culture", Culture);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDistinictCultureKeys:For BusinessKey", Culture);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Culture Keys
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateCultureKeys(List<DO_LanguageCulture> obj)
        {

            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    return true;
                });

                var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Culture/InsertOrUpdateCultureKeys", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateCultureKeys:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Export(string cultureval, string culture)
        {
            DataTable dt = new DataTable(cultureval);
            dt.Columns.AddRange(new DataColumn[3] { new DataColumn("Key"),
                                        new DataColumn("Value"),
                                        new DataColumn("CultureValue") });


            var parameter = "?culture=" + culture;
            var serviceResponse = await _eSyalocalizeAPIServices.HttpClientServices.GetAsync<List<DO_LanguageCulture>>("Culture/GetDistinictCultureKeys" + parameter);
            //if (serviceResponse.Status)
            //{
            //    return Json(serviceResponse.Data);

            //}
            //else
            //{
            //    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDistinictCultureKeys:For Culture", Culture);
            //    return Json(new { Status = false, StatusCode = "500" });
            //}

            foreach (var lang in serviceResponse.Data)
            {
                dt.Rows.Add(lang.Key, lang.Value, lang.CultureValue);
            }

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", cultureval + ".xlsx");

                }
            }
        }
        #endregion
    }
}
