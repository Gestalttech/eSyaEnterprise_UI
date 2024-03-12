using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.Localize.Models;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class ParametersController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<ParametersController> _logger;

        public ParametersController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<ParametersController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }
        #region eSya Parameters
        /// <summary>
        /// Parameters
        /// </summary>
        /// 
        [Area("ProductSetup")]
        //[ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_03_00()
        {
            ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsDelete = true, IsView = true };
            ViewBag.formName = "Parameters";
            return View();
        }
        /// <summary>
        ///Get Parameters Information By Parameter Type
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetParametersInformationByParameterType(string parameterType)
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_Parameters>>("Parameters/GetParametersInformationByParameterType?parameterType=" + parameterType);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetParametersInformationByParameterType:For parameterType {0}", parameterType);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetParametersInformationByParameterType:For parameterType {0} ", parameterType);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into / Update Parameter
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateParameters(DO_Parameters pa_rm)
        {
            try
            {
                pa_rm.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                pa_rm.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                pa_rm.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                if (pa_rm.ParameterId == 0)
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Parameters/InsertIntoParameters", pa_rm);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Parameters/UpdateParameters", pa_rm);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateParameters:params:" + JsonConvert.SerializeObject(pa_rm));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Parameter Header Information
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetParametersHeaderInformation()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_Parameters>>("Parameters/GetParametersHeaderInformation");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetParametersHeaderInformation");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetParametersHeaderInformation");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Into Parameter Header
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertIntoParameterHeader(DO_Parameters pa_rh)
        {
            try
            {
                pa_rh.ParameterDesc = string.IsNullOrEmpty(pa_rh.ParameterDesc) ? string.Empty : pa_rh.ParameterDesc;
                pa_rh.ParameterValueType = string.IsNullOrEmpty(pa_rh.ParameterValueType) ? string.Empty : pa_rh.ParameterValueType;
                pa_rh.ParameterValue = string.IsNullOrEmpty(pa_rh.ParameterValue) ? string.Empty : pa_rh.ParameterValue;

                pa_rh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                pa_rh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                pa_rh.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Parameters/InsertIntoParameterHeader", pa_rh);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoParameterHeader:params:" + JsonConvert.SerializeObject(pa_rh));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Parameter Header
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateParameterHeader(DO_Parameters pa_rh)
        {
            try
            {
                pa_rh.ParameterDesc = string.IsNullOrEmpty(pa_rh.ParameterDesc) ? string.Empty : pa_rh.ParameterDesc;
                pa_rh.ParameterValueType = string.IsNullOrEmpty(pa_rh.ParameterValueType) ? string.Empty : pa_rh.ParameterValueType;
                pa_rh.ParameterValue = string.IsNullOrEmpty(pa_rh.ParameterValue) ? string.Empty : pa_rh.ParameterValue;

                pa_rh.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                pa_rh.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                pa_rh.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();

                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Parameters/UpdateParameterHeader", pa_rh);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateParameterHeader:params:" + JsonConvert.SerializeObject(pa_rh));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        ///Active Or De Active Parameter Header
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveParameterHeader(bool status, int parm_type)
        {
            try
            {

                var parameter = "?status=" + status + "&parm_type=" + parm_type;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Parameters/ActiveOrDeActiveParameterHeader" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveParameterHeader:For parm_type {0} ", parm_type);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion

        
    }
}
