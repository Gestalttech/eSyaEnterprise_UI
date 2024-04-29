using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.Admin.Data;
using eSyaEnterprise_UI.Areas.Admin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Admin.Controllers
{
    [SessionTimeout]
    public class DepartmentController : Controller
    {
        private readonly IeSyaAdminAPIServices _eSyaAdminAPIServices;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(IeSyaAdminAPIServices eSyaAdminAPIServices, ILogger<DepartmentController> logger)
        {
            _eSyaAdminAPIServices = eSyaAdminAPIServices;
            _logger = logger;
        }


        #region Define Department Codes

        /// <summary>
        ///  Define Department Codes
        /// </summary>
        /// <returns></returns

        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EAD_07_00()
        {
            try
            {
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Department/GetUserDefinedCodeTypesList"+ ApplicationCodeTypeValues.DepartmentCategory);
                if (serviceResponse.Status)
                {
                    ViewBag.DepartmentCategory = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
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
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_Department>>("ApplicationCodes/GetApplicationCodesByCodeType" + parameter);
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
        public async Task<JsonResult> InsertOrAudateApplicationCodes(DO_Department obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (obj.DeptId == 0)
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/InsertIntoApplicationCodes", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ApplicationCodes/UpdateApplicationCodes", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrAudateApplicationCodes:params:" + JsonConvert.SerializeObject(obj));
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
