﻿using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.ProductSetup.Models;
using eSyaEnterprise_UI.DataServices;
using eSyaEnterprise_UI.Extension;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace eSyaEnterprise_UI.Areas.ProductSetup.Controllers
{
    [SessionTimeout]
    public class CurrenciesController : Controller
    {

        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<CurrenciesController> _logger;

        public CurrenciesController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<CurrenciesController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }


        #region Currency Master
        /// <summary>
        /// Currency Master
        /// </summary>
        /// <returns></returns>

        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public IActionResult EPS_11_00()
        {
            return View();
        }

        /// <summary>
        ///Get Currency for Grid
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCurrencyMaster()
        {

            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyMaster>>("Currencies/GetCurrencyMaster");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyMaster");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCurrencyMaster");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Currency Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertIntoCurrencyMaster(DO_CurrencyMaster currency)
        {

            try
            {
                currency.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                currency.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                currency.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Currencies/InsertIntoCurrencyMaster", currency);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertIntoCurrencyMaster:params:" + JsonConvert.SerializeObject(currency));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Update Currency Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> UpdateCurrencyMaster(DO_CurrencyMaster currency)
        {

            try
            {
                currency.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                currency.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                currency.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Currencies/UpdateCurrencyMaster", currency);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:UpdateCurrencyMaster:params:" + JsonConvert.SerializeObject(currency));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Currency Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveCurrencyMaster(bool status, string currency_code)
        {

            try
            {

                var parameter = "?status=" + status + "&currency_code=" + currency_code;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Currencies/ActiveOrDeActiveCurrencyMaster" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveCurrencyMaster:For currency_code {0} ", currency_code);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion Currency Master


        #region Currency Denominations
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_12_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyMaster>>("Currencies/GetActiveCurrencyList");
                if (serviceResponse.Status)
                {
                    ViewBag.currencies = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.CurrencyCode.ToString(),
                        Text = b.CurrencyName,
                    }).ToList();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveCurrencyList");
                    throw new Exception("Internal Error");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveCurrencyList");
                throw ex;
            }
            return View();
        }

        /// <summary>
        ///Get Currency DenominationInfo By Currency Code for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCurrencyDenominationInfoByCurrencyCode(string CurrencyCode)
        {
            try
            {
                var parameter = "?currencyCode=" + CurrencyCode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyDenominationInformation>>("Currencies/GetCurrencyDenominationInfoByCurrencyCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyDenominationInfoByCurrencyCode:For CurrencyCode {0}", CurrencyCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCurrencyDenominationInfoByCurrencyCode:For CurrencyCode {0}", CurrencyCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Insert Or Update Currency DenominationInfo
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertUpdateCurrencyDenominationInformation(bool isInsert, DO_CurrencyDenominationInformation obj)
        {
            try
            {
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (isInsert)
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Currencies/InsertCurrencyDenominationInformation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Currencies/UpdateCurrencyDenominationInformation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertUpdateCurrencyDenominationInformation:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Delete Currency DenominationInfo
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> DeleteCurrencyDenominationInformation(string currencyCode, decimal DenomId, string BnorCNId)
        {
            try
            {
                var parameter = "?currencyCode=" + currencyCode + "&DenomId=" + DenomId + "&BnorCNId=" + BnorCNId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Currencies/DeleteCurrencyDenominationInformation" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:DeleteCurrencyDenominationInformation:For currencyCode {0} with denomination entered {1} with BnorCNId entered {2}", currencyCode, DenomId, BnorCNId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Currency Denomination
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveCurrencyDenomination(bool status, string currencycode, int denomId)
        {

            try
            {

                var parameter = "?status=" + status + "&currencycode=" + currencycode + "&denomId=" + denomId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Currencies/ActiveOrDeActiveCurrencyDenomination" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveCurrencyDenomination:For denomId {0} ", denomId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        #endregion
    }
}
