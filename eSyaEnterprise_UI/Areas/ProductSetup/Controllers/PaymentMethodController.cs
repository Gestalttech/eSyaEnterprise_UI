using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.EndUser.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class PaymentMethodController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<PaymentMethodController> _logger;
        public PaymentMethodController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<PaymentMethodController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_17_00()
        {
            try
            {
                List<int> l_ac = new List<int>();
                l_ac.Add(ApplicationCodeTypeValues.PaymentMethod);
                l_ac.Add(ApplicationCodeTypeValues.InstrumentType);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("ConfigMasterData/GetApplicationCodesByCodeTypeList", l_ac);
                if (serviceResponse.Status)
                {
                   
                    if (serviceResponse.Data != null)
                    {
                        List<DO_ApplicationCodes> app_codes = serviceResponse.Data;
                        var payment = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.PaymentMethod);
                        if (payment != null)
                        {
                            ViewBag.PaymentMethod = payment.Select(b => new SelectListItem
                            {
                                Value = b.ApplicationCode.ToString(),
                                Text = b.CodeDesc,
                            }).ToList();

                          
                        }
                        var Instrument = app_codes.Where(w => w.CodeType == ApplicationCodeTypeValues.InstrumentType);
                        if (Instrument != null)
                        {
                            ViewBag.InstrumentType = Instrument.Select(b => new SelectListItem
                            {
                                Value = b.ApplicationCode.ToString(),
                                Text = b.CodeDesc,
                            }).ToList();

                        }
                       
                    }

                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApplicationCodesByCodeTypeList");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeTypeList");
                throw ex;
            }
        }

        /// <summary>
        ///Get Payment Method for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetPaymentMethodbyISDCode(int ISDCode)
        {

            try
            {
                var parameter = "?ISDCode="+ ISDCode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_PaymentMethod>>("PaymentMethod/GetPaymentMethodbyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPaymentMethodbyISDCode");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPaymentMethodbyISDCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Payment Method
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePaymentMethod(DO_PaymentMethod obj)
        {

            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
              
               
               
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("PaymentMethod/InsertOrUpdatePaymentMethod", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePaymentMethod:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
    }
}
