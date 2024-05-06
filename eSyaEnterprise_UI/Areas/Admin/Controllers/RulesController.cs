using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.Admin.Data;
using eSyaEnterprise_UI.Areas.Admin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEssentials_UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.Admin.Controllers
{
    [SessionTimeout]
    public class RulesController : Controller
    {
        private readonly IeSyaAdminAPIServices _eSyaAdminAPIServices;
        private readonly ILogger<RulesController> _logger;
        public RulesController(IeSyaAdminAPIServices eSyaAdminAPIServices, ILogger<RulesController> logger)
        {
            _eSyaAdminAPIServices = eSyaAdminAPIServices;
            _logger = logger;
        }

        #region Inventory Rules
        //Inventory Rules
        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAD_05_00()
        {
            return View();
        }

        /// <summary>
        /// Getting Inventory Rules for Grid
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> GetInventoryRules()
        {
            try
            {
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_InventoryRules>>("Rules/GetInventoryRules");
                if (serviceResponse.Status)
                {

                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetInventoryRules");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetInventoryRules");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        [Area("Admin")]
        /// <summary>
        /// Insert or Update Inventory Rules
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateInventoryRules(DO_InventoryRules rule)
        {

            try
            {
                rule.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                rule.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                rule.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (rule.Isadd == 1)
                {

                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertInventoryRule", rule);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/UpdateInventoryRule", rule);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateInventoryRules:params:" + JsonConvert.SerializeObject(rule));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Inventory Rules
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveInventoryRules(bool status, string InventoryId)
        {

            try
            {

                var parameter = "?status=" + status + "&InventoryId=" + InventoryId;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Rules/ActiveOrDeActiveInventoryRules" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveInventoryRules:For InventoryId {0} ", InventoryId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Inventory Rules

        #region Unit of Measure
        //Unit of Measure
        [Area("Admin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task <IActionResult> EAD_06_00()
        {
            try
            {
                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.Uompurchase);
                l_ac.Add(ApplicationCodeTypeValues.Uomstock);
                var response = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("Rules/GetApplicationCodesByCodeTypeList", l_ac);

                if (response.Status)
                {
                    List<DO_ApplicationCodes> app_codes = response.Data;

                    ViewBag.Uompurchase = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.Uompurchase).Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc
                    }).ToList();

                    ViewBag.Uomstock = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.Uomstock).Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc
                    }).ToList();
                   
                        return View();
                    
                    
                }
                else
                {
                    _logger.LogError(new Exception(response.Message), "UD:GetApplicationCodesByCodeTypeList");
                    return View();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeTypeList");
                throw ex;
            }
        }

        /// <summary>
        /// Getting Unit Measure List for Grid
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> GetUnitofMeasurements()
        {
            try
            {
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<List<DO_UnitofMeasure>>("Rules/GetUnitofMeasurements");
                if (serviceResponse.Status)
                {

                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUnitofMeasurements");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUnitofMeasurements");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Unite of Measure
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateUnitofMeasurement(DO_UnitofMeasure uoms)
        {

            try
            {
                uoms.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                uoms.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                uoms.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Rules/InsertOrUpdateUnitofMeasurement", uoms);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoCurrencyMaster:params:" + JsonConvert.SerializeObject(uoms));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Unit of Measure
        /// </summary>
        [Area("Admin")]
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveUnitofMeasure(bool status, int unitId)
        {

            try
            {

                var parameter = "?status=" + status + "&unitId=" + unitId;
                var serviceResponse = await _eSyaAdminAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Rules/ActiveOrDeActiveUnitofMeasure" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveUnitofMeasure:For unitId {0} ", unitId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Unit of Measure
    }
}
