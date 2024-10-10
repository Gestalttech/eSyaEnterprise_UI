using eSya.Finance.DO;
using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigFin.Models;
using eSyaEnterprise_UI.Areas.FinAdmin.Data;
using eSyaEnterprise_UI.Areas.FinAdmin.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using eSyaEssentials_UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.FinAdmin.Controllers
{
    public class ExRatesController : Controller
    {
        private readonly IeSyaFinAdminAPIServices _eSyaFinAdminAPIServices;
        private readonly ILogger<ExRatesController> _logger;
        public ExRatesController(IeSyaFinAdminAPIServices eSyaFinAdminAPIServices, ILogger<ExRatesController> logger)
        {
            _eSyaFinAdminAPIServices = eSyaFinAdminAPIServices;
            _logger = logger;
        }

        [Area("FinAdmin")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EFA_02_00()
        {
            //int BusinessKey = AppSessionVariables.GetSessionBusinessKey(HttpContext);
            //var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyMaster>>("CommonData/GetActiveCurrencyCodes?BusinessKey=" + BusinessKey);
            //if (serviceResponse.Status && countryResponse.Status)
            //{
            //    ViewBag.CurrencyCodeList = serviceResponse.Data.Select(b => new SelectListItem
            //    {
            //        Value = b.CurrencyCode.ToString(),
            //        Text = b.CurrencyName,
            //    }).ToList();

            //    ViewBag.DomainName = this.Request.PathBase;
            //    ViewBag.CountryCodes = countryResponse.Data;
            //    return View();
            //}
            var countryResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CountryMaster>>("CommonData/GetActiveCountryCodes");

            if ( countryResponse.Status)
            {
                
                ViewBag.DomainName = this.Request.PathBase;
                ViewBag.CountryCodes = countryResponse.Data;
                return View();
            }
            else
            {
                _logger.LogError(new Exception(countryResponse.Message), "UD:GetActiveCountryCodes");
                return Json(new { Status = false, StatusCode = "500" });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetActiveExchangeCurrencyCodes(string Countrycode)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyMaster>>("CommonData/GetActiveExchangeCurrencyCodes?Countrycode=" + Countrycode);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveExchangeCurrencyCodes");
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveExchangeCurrencyCodes");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveExchangeCurrencyCodes");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        [HttpGet]
        public async Task<ActionResult> FillExchangeRate(string Countrycode)
        {
            try
            {
                var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyExchangeRate>>("ExchangeRate/FillExchangeRate?Countrycode="+ Countrycode);
                
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        var data = serviceResponse.Data;
                        return Json(data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:FillExchangeRate");
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:FillExchangeRate");
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:FillExchangeRate");
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }

        public async Task<ActionResult> InsertUpdateExchangeRate(bool insert,DO_CurrencyExchangeRate obj)
        {
            try
            {
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.CreatedON = DateTime.Now;
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                if (insert)
                {
                    var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ExchangeRate/InsertIntoExchangeRate", obj);

                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:InsertIntoExchangeRate:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertIntoExchangeRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    var serviceResponse = await _eSyaFinAdminAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("ExchangeRate/UpdateIntoExchangeRate", obj);

                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Data.Message), "UD:UpdateIntoExchangeRate:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Data.Message });
                        }

                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateIntoExchangeRate:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateCostCenterClass:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = ex.ToString() });
            }
        }
    }
}
