using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigProduct.Data;
using eSyaEnterprise_UI.Areas.ConfigProduct.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigProduct.Controllers
{
    [SessionTimeout]
    public class AgeRangeController : Controller
    {
        private readonly IeSyaConfigProductAPIServices _eSyaConfigProductAPIServices;
        private readonly ILogger<AgeRangeController> _logger;

        public AgeRangeController(IeSyaConfigProductAPIServices eSyaConfigProductAPIServices, ILogger<AgeRangeController> logger)
        {
            _eSyaConfigProductAPIServices = eSyaConfigProductAPIServices;
            _logger = logger;
        }
        #region Age Range
        [Area("ConfigProduct")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_33_00()
        {
            return View();
        }
        /// <summary>
        ///Get Age Range for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAgeRanges()
        {

            try
            {
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<List<DO_AgeRange>>("AgeRange/GetAgeRanges");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAgeRanges");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAgeRanges");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Age Range
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateAgeRange(DO_AgeRange obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("AgeRange/InsertOrUpdateAgeRange", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateAgeRange:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Age Range
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveAgeRange(bool status, int ageId)
        {

            try
            {

                var parameter = "?status=" + status + "&ageId=" + ageId;
                var serviceResponse = await _eSyaConfigProductAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("AgeRange/ActiveOrDeActiveAgeRange" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveAgeRange:For ageId {0} ", ageId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
