using DocumentFormat.OpenXml.Wordprocessing;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Data;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigFin.Controllers
{
    [SessionTimeout]
    public class ParameterController : Controller
    {
        private readonly IeSyaFinanceAPIServices _eSyaFinanceAPIServices;
        private readonly ILogger<ParameterController> _logger;
        public ParameterController(IeSyaFinanceAPIServices eSyaFinanceAPIServices, ILogger<ParameterController> logger)
        {
            _eSyaFinanceAPIServices = eSyaFinanceAPIServices;
            _logger = logger;
        }

        #region Parameters
        [Area("ConfigFin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EAC_04_00()
        {
            return View();
        }

        [HttpGet]
        public async Task<ActionResult> GetAccountGLType()
        {
            try
            {
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_COAParameter>>("COAParameter/GetAccountGLType");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAccountGLType");
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAccountGLType");
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAccountGLType");
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetGLTypeDescription()
        {
            try
            {
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.GetAsync<List<DO_COAParameter>>("COAParameter/GetGLTypeDescription");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetGLTypeDescription");
                        return Json(new { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetGLTypeDescription");
                    return Json(new { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetGLTypeDescription");
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> InsertAccountGLType(DO_COAParameter obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.CreatedTerminal = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("COAParameter/InsertAccountGLType", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateAccountGLType(DO_COAParameter obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.CreatedTerminal = AppSessionVariables.GetIPAddress(HttpContext);


                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("COAParameter/UpdateAccountGLType", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateAccountGLType:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpPost]
        public async Task<ActionResult> DeleteAccountGLType(bool status, int ParameterID)
        {
            try
            {
                DO_COAParameter obj = new DO_COAParameter();
                obj.ParameterID = ParameterID;
                obj.ParameterDesc = "NA";
                obj.UsageStatus = status;
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedBy = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.CreatedTerminal = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaFinanceAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("COAParameter/DeleteAccountGLType", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:DeleteAccountGLType:params:" + ParameterID);
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:DeleteAccountGLType:params:" + ParameterID);
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteAccountGLType:params:" + ParameterID);
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        #endregion
    }
}
