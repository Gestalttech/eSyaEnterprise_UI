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
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Department/GetDepartmentCategoriesbyCodeType?codetype=" + ApplicationCodeTypeValues.DepartmentCategory);
                if (serviceResponse.Status)
                {
                    ViewBag.DepartmentCategories = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDepartmentCategoriesbyCodeType");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDepartmentCategoriesbyCodeType");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Departments by categoryId for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDepartmentsbycategoryId(int categoryId)
        {

            try
            {
                var parameter = "?categoryId=" + categoryId;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_Department>>("Department/GetDepartmentsbycategoryId" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDepartmentsbycategoryId:For categoryId {0}", categoryId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDepartmentsbycategoryId:For categoryId {0} ", categoryId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Application Codes 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDepartmentCodes(DO_Department obj)
        {

            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (obj.DeptId == 0)
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Department/InsertIntoDepartment", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Department/UpdateDepartment", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDepartmentCodes:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Application Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveDepartment(bool status, int categoryId, int deptId)
        {

            try
            {

                var parameter = "?status=" + status + "&categoryId=" + categoryId + "&deptId=" + deptId;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Department/ActiveOrDeActiveDepartment" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveDepartment:For deptId {0} ", deptId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion


    }
}
