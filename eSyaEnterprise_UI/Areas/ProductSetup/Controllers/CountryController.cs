using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
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
    public class CountryController : Controller
    {
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<CountryController> _logger;
        private readonly IWebHostEnvironment _env;
        public CountryController(IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, IWebHostEnvironment env, ILogger<CountryController> logger)
        {
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _env = env;
            _logger = logger;
        }

        #region Country Info
        /// <summary>
        /// Country Information
        /// </summary>
        /// <returns></returns>
        /// 
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_13_00()
        {
            try
            {
                var domainname = this.Request.PathBase;
                var ImagePath = Path.Combine(_env.WebRootPath, "Uploads/CountryFlagICons");
                DirectoryInfo dir = new DirectoryInfo(ImagePath);
                FileInfo[] files = dir.GetFiles();

                var localdname = domainname + "Uploads/CountryFlagICons";
                var serverdname = domainname + "/Uploads/CountryFlagICons";

                List<IMGCountryFlag> ImageList = new List<IMGCountryFlag>();
                foreach (var item in files)
                {
                    IMGCountryFlag obj = new IMGCountryFlag()
                    {
                        Name = item.Name,
                        localDomainwithPath = localdname,
                        ServerDomainwithPath = serverdname,
                        DomainName = domainname
                    };
                    ImageList.Add(obj);

                }
                ViewBag.Images = ImageList;
                /// Getting Currency List
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CurrencyMaster>>("Currencies/GetActiveCurrencyList");

                var serviceNationality = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("ConfigMasterData/GetApplicationCodesByCodeType?codeType="+ ApplicationCodeTypeValues.Nationality);
                if (serviceResponse.Status && serviceNationality.Status)
                {
                    ViewBag.Nationality = serviceNationality.Data;
                    ViewBag.currencyList = serviceResponse.Data;
                    return View();


                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveCurrencyList");
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveCurrencyList");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Country Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateCountryCodes(DO_CountryCodes country)
        {
            try
            {
                string filePath = "Uploads/CountryFlagICons/" + country.imgName;
                country.CountryFlag = filePath;
                country.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                country.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                country.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                if (country._lstUIDpattern != null)
                {
                    country._lstUIDpattern.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                        return true;
                    });
                }
                if (country.Isadd == 1)
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Country/InsertIntoCountryCode", country);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

                else
                {
                    var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Country/UpdateCountryCode", country);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateCountryCodes:params:" + JsonConvert.SerializeObject(country));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        /// <summary>
        ///Get All Country Codes for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetAllCountryCodes()
        {

            try
            {
                var domainname = this.Request.PathBase;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("Country/GetAllCountryCodes");

                if (serviceResponse.Status)
                {
                    var data = serviceResponse.Data;
                    List<DO_CountryCodes> countries = new List<DO_CountryCodes>();
                    //for server hosting
                    foreach (var item in data)
                    {
                        DO_CountryCodes country = new DO_CountryCodes()
                        {
                            Isdcode = item.Isdcode,
                            CountryCode = item.CountryCode,
                            CountryName = item.CountryName,
                            CountryFlag = domainname + item.CountryFlag,
                            CurrencyCode = item.CurrencyCode,
                            MobileNumberPattern = item.MobileNumberPattern,
                            //Uidlabel = item.Uidlabel,
                            //Uidpattern = item.Uidpattern,
                            Nationality = item.Nationality,
                            IsPoboxApplicable = item.IsPoboxApplicable,
                            PoboxPattern = item.PoboxPattern,
                            IsPinapplicable = item.IsPinapplicable,
                            PincodePattern = item.PincodePattern,
                            ActiveStatus = item.ActiveStatus,
                            postedfile = item.postedfile,
                            imgName = item.imgName,
                            CurrencyName = item.CurrencyName,
                            DateFormat=item.DateFormat,
                            ShortDateFormat=item.ShortDateFormat
                        };
                        countries.Add(country);
                    }
                    return Json(countries);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetAllCountryCodes");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetAllCountryCodes");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Country Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveCountryCode(bool status, int Isd_code)
        {

            try
            {

                var parameter = "?status=" + status + "&Isd_code=" + Isd_code;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Country/ActiveOrDeActiveCountryCode" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveCountryCode:For codeType {0} ", Isd_code);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get UID Patterns by Isd Code and UID Label.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetUIDPatternbyIsdcode(int Isdcode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_UIDPattern>>("Country/GetUIDPatternbyIsdcode" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUIDPatternbyIsdcode:For Isdcode {0}", Isdcode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetUIDPatternbyIsdcode:For Isdcode {0}", Isdcode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetUIDPatternbyIsdcode:For Isdcode {0}", Isdcode);
                throw ex;
            }
        }

        #endregion   Country Info

        #region Statutory Details-Country  wise

        /// <summary>
        /// Country Statutory Details
        /// </summary>
        /// <returns> </returns>
        /// </summary>
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_14_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("ConfigMasterData/GetISDCodes");
                if (serviceResponse.Status)
                {
                    ViewBag.Isdcodes = serviceResponse.Data;
                    return View();

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetISDCodes");
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetISDCodes");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Statutory Parameter List by ISD Code & Statutory Code
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStatutoryCodesParameterList(int IsdCode, int StatutoryCode)
        {
            try
            {
                var parameter = "?IsdCode=" + IsdCode + "&StatutoryCode=" + StatutoryCode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("Country/GetStatutoryCodesParameterList" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatutoryCodesParameterList:For IsdCode {0} with StatutoryCode entered {1}", IsdCode, StatutoryCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatutoryCodesParameterList:For IsdCode {0} with StatutoryCode entered {1}", IsdCode, StatutoryCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStatutoryCodesParameterList:For IsdCode {0} with StatutoryCode entered {1}", IsdCode, StatutoryCode);
                throw ex;
            }
        }

        /// <summary>
        /// Get Country Statutory Details by ISD Code for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStatutoryCodesbyIsdcode(int Isdcode)
        {
            try
            {
                var parameter = "?Isdcode=" + Isdcode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CountryStatutoryDetails>>("Country/GetStatutoryCodesbyIsdcode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatutoryCodesbyIsdcode:For ISDCode {0}", Isdcode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStatutoryCodesbyIsdcode:For ISDCode {0}", Isdcode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert or Update Country Statutory Details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateStatutoryCodes(DO_CountryStatutoryDetails obj)
        {

            try
            {
                if (obj.Isdcode == 0)
                {
                    return Json(new { Status = false, Message = "Please Select ISD Code" });
                }
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Country/InsertOrUpdateStatutoryCodes", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateStatutoryCodes:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate StatutoryCodes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveStatutoryCode(bool status, int Isd_code, int statutorycode)
        {

            try
            {

                var parameter = "?status=" + status + "&Isd_code=" + Isd_code + "&statutorycode=" + statutorycode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Country/ActiveOrDeActiveStatutoryCode" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveStatutoryCode:For statutorycode {0} ", statutorycode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion  Statutory Details-Country  wise

        #region Country Mobile Carrier
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public  IActionResult EPS_18_00()
        {
            return View();
        }

        /// <summary>
        ///Get Mobile Carriers for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetMobileCarriers()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_MobileCarrier>>("MobileCarrier/GetMobileCarriers");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMobileCarriers");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetMobileCarriers");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetMobileCarriers");
                throw;
            }
        }


        /// <summary>
        /// Insert Or Update Mobile Carrier 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateMobileCarrier(DO_MobileCarrier obj)
        {
            try
            {

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                   
                        var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("MobileCarrier/InsertOrUpdateMobileCarrier", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateMobileCarrier:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    
                  
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateMobileCarrier:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Mobile Carrier
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveMobileCarrier(bool status, int ISDCode, string MobilePrefix)
        {

            try
            {

                var parameter = "?status=" + status + "&ISDCode=" + ISDCode + "&MobilePrefix=" + MobilePrefix;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("MobileCarrier/ActiveOrDeActiveMobileCarrier" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveMobileCarrier:For MobilePrefix {0} ", MobilePrefix);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region State GST Tax Identification
        [Area("ProductSetup")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPS_19_00()
        {
            try
            {
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("ConfigMasterData/GetIndiaISDCodes");
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        ViewBag.ISDCodeList = serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.Isdcode.ToString(),
                            Text = b.Isdcode.ToString() + '-' + b.CountryName,
                        }).ToList();
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:TaxIdentification");
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:TaxIdentification");
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:TaxIdentification");
                throw;
            }
        }
        /// <summary>
        ///Get Tax Identification by Country Code for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetTaxIdentificationByISDCode(int ISDCode)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<List<DO_TaxIdentification>>("TaxIdentification/GetTaxIdentificationByISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetTaxIdentificationByISDCode:For ISDCode {0}", ISDCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetTaxIdentificationByISDCode:For ISDCode {0}", ISDCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetTaxIdentificationByISDCode:For ISDCode {0}", ISDCode);
                throw;
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        /// <summary>
        /// Insert Tax Identification 
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateTaxIdentification(DO_TaxIdentification tax_Ident)
        {
            try
            {
                if (string.IsNullOrEmpty(tax_Ident.TaxIdentificationId.ToString()) || tax_Ident.TaxIdentificationId == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Tax Identification" });
                }
                if (string.IsNullOrEmpty(tax_Ident.TaxIdentificationDesc))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Tax Identification Description" });
                }
                //else if (string.IsNullOrEmpty(tax_Ident.TaxCode.ToString()) || tax_Ident.TaxCode == 0)
                //{
                //    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Tax Description" });
                //}
                else
                {
                    tax_Ident.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    tax_Ident.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    tax_Ident.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    if (tax_Ident.InsertStatus == 0)
                    {
                        var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TaxIdentification/InsertIntoTaxIdentiFication", tax_Ident);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateTaxIdentification:params:" + JsonConvert.SerializeObject(tax_Ident));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("TaxIdentification/UpdateTaxIdentiFication", tax_Ident);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateTaxIdentification:params:" + JsonConvert.SerializeObject(tax_Ident));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateTaxIdentification:params:" + JsonConvert.SerializeObject(tax_Ident));
                return Json(new { Status = false, Message = ex.ToString() });
                //return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Tax Identification
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveTaxIdentification(bool status, int Isd_code, int TaxIdentificationId)
        {

            try
            {

                var parameter = "?status=" + status + "&Isd_code=" + Isd_code + "&TaxIdentificationId=" + TaxIdentificationId;
                var serviceResponse = await _eSyaProductSetupAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("TaxIdentification/ActiveOrDeActiveTaxIdentification" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveTaxIdentification:For TaxIdentificationId {0} ", TaxIdentificationId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
