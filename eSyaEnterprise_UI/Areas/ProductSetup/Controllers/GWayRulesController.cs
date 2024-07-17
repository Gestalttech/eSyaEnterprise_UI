using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class GWayRulesController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<GWayRulesController> _logger;
        public GWayRulesController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<GWayRulesController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }
        #region Define Gate way Rules
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_20_00()
        {
            return View();
        }


        /// <summary>
        ///Get Gate way Rules for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetGatewayRules()
        {

            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_GatewayRules>>("Gateway/GetGatewayRules");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetGatewayRules");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetGatewayRules");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Gate way Rules
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateGatewayRules(DO_GatewayRules obj)
        {

            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Gateway/InsertOrUpdateGatewayRules", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateGatewayRules:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Gate way Rules
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveGatewayRules(bool status, int GwRuleId)
        {

            try
            {

                var parameter = "?status=" + status + "&GwRuleId=" + GwRuleId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Gateway/ActiveOrDeActiveGatewayRules" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveGatewayRules:For GwRuleId {0} ", GwRuleId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
    }
}
