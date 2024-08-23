using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Areas.FinAdmin.Data;
using eSyaEnterprise_UI.Areas.FinAdmin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    [SessionTimeout]
    public class SwipeController : Controller
    {
        private readonly IeSyaFinAdminAPIServices _eSyaFinAdminAPIServices;
        private readonly ILogger<SwipeController> _logger;
        public SwipeController(IeSyaFinAdminAPIServices eSyaFinAdminAPIServices, ILogger<SwipeController> logger)
        {
            _eSyaFinAdminAPIServices = eSyaFinAdminAPIServices;
            _logger = logger;
        }

        #region Manage Swipe Machine
        [Area("FinAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EFA_03_00()
        {
            var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonData/GetBusinessKey");
            if (serviceResponse.Status)
            {
                ViewBag.BusinessKeyList = serviceResponse.Data.Select(b => new SelectListItem
                {
                    Value = b.BusinessKey.ToString(),
                    Text = b.LocationDescription,
                }).ToList();

                return View();
            }
            else
            {
                _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessKey");
                return Json(new { Status = false, StatusCode = "500" });
            }
        }
        [HttpGet]
        public async Task<ActionResult> GetSwipMachinesbyBusinessKey(int businessKey)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_SwipingMachine>>("SwipingMachine/GetSwipMachinesbyBusinessKey?businessKey="+ businessKey);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSwipMachinesbyBusinessKey");
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetSwipMachinesbyBusinessKey");
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetSwipMachinesbyBusinessKey");
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<ActionResult> InsertOrUpdateSwipMachine(DO_SwipingMachine obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SwipingMachine/InsertOrUpdateSwipMachine", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertOrUpdateSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeleteSwipMachine(DO_SwipingMachine obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("SwipingMachine/DeleteSwipMachine", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteSwipMachine:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
        #endregion
    }
}
