using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Data;
using eSyaEnterprise_UI.Areas.ConfigBusiness.Models;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Text;

namespace eSyaEnterprise_UI.Areas.ConfigBusiness.Controllers
{
    [SessionTimeout]
    public class LocationController : Controller
    {
        private readonly IeSyaConfigBusinessAPIServices _eSyaConfigBusinessAPIServices;
        private readonly ILogger<LocationController> _logger;


        public LocationController(IeSyaConfigBusinessAPIServices eSyaConfigBusinessAPIServices, ILogger<LocationController> logger)
        {
            _eSyaConfigBusinessAPIServices = eSyaConfigBusinessAPIServices;
            _logger = logger;
        }


        #region New Business Location
        /// <summary>
        /// Business Location
        /// </summary>
        /// <returns></returns>
        /// 
        [Area("ConfigBusiness")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> ECB_02_00()
        {
            try
            {
                ViewBag.UserFormRole = new DO_UserFormRole { IsInsert = true, IsEdit = true, IsView = true, IsDelete = true };

                /// Tax Identification for Dropdown
                var IsdcodeResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("ConfigMasterData/GetISDCodes");
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessEntity>>("License/GetActiveBusinessEntities");

                if (serviceResponse.Status && IsdcodeResponse.Status)
                {
                    if (IsdcodeResponse.Data != null)
                    {
                        ViewBag.IsdCodes = IsdcodeResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.Isdcode.ToString(),
                            Text = b.CountryName,
                        }).ToList();

                        ViewBag.entity_list = serviceResponse.Data;
                    }
                    if (serviceResponse.Data != null)
                    {
                        ViewBag.entity_list = serviceResponse.Data.Select(b => new SelectListItem
                        {
                            Value = b.BusinessId.ToString(),
                            Text = b.BusinessDesc,
                        }).ToList();

                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:BusinessLocation");
                }

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:BusinessLocation");
                throw;
            }
        }
        /// <summary>
        ///Get Tax Idendification for drop down by Isd code
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetTaxIdentificationListByIsdCode(int IsdCode)
        {
            try
            {
                var parameter = "?IsdCode=" + IsdCode;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_TaxIdentification>>("License/GetTaxIdentificationByISDCode" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetTaxIdentificationByISDCode:For BusinessId {0}", IsdCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetTaxIdentificationByISDCode:For BusinessId {0}", IsdCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessSegmentByBusinessId:For BusinessId {0}", IsdCode);
                throw;
            }
        }

        /// <summary>
        ///Get Currencies for drop down by Isd code 
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCurrencyListbyIsdCode(int IsdCode)
        {
            try
            {
                var parameter = "?IsdCode=" + IsdCode;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("License/GetCurrencyListbyIsdCode" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyListbyIsdCode:For IsdCode {0}", IsdCode);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencyListbyIsdCode:For IsdCode {0}", IsdCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCurrencyListbyIsdCode:For IsdCode {0}", IsdCode);
                throw;
            }
        }
        /// <summary>
        /// Get City List by isdCode and stateCode.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetCityListbyISDCode(int isdCode)
        {
            try
            {
                var parameter = "?isdCode=" + isdCode;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_Cities>>("License/GetCityListbyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCityListbyISDCode:For isdCode {0} ", isdCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCityListbyISDCode:For isdCode {0} ", isdCode);
                throw;
            }
        }

        /// <summary>
        ///Get default Date format from country Master
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDateFormatbyISDCode(int isdCode)
        {

            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_BusinessLocation>("License/GetDateFormatbyISDCode?isdCode=" + isdCode);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDateFormatbyISDCode");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDateFormatbyISDCode");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        ///Get Business Locations  for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessLocationByBusinessId(int BusinessId)
        {

            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("License/GetBusinessLocationByBusinessId?BusinessId=" + BusinessId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessLocationByBusinessId");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessLocationByBusinessId");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Business Locations
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateBusinessLocation(bool isInsert, DO_BusinessLocation obj)
        {

            try
            {
                //if (obj.EBusinessKey == null)
                //{
                //    obj.EBusinessKey = Encoding.ASCII.GetBytes("0");
                //}
                //if (obj.EActiveUsers == null)
                //{
                //    obj.EActiveUsers = Encoding.ASCII.GetBytes("0");
                //}

                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormId = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (obj.l_BSCurrency != null)
                {
                    obj.l_BSCurrency.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });
                }

                if (obj.l_Preferredlanguage != null)
                {
                    obj.l_Preferredlanguage.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });
                }
                if (isInsert)
                {
                    var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertBusinessLocation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/UpdateBusinessLocation", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessLocation:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Activate or De Activate Business Location
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveBusinessLocation(bool status, int BusinessId, int locationId)
        {

            try
            {

                var parameter = "?status=" + status + "&BusinessId=" + BusinessId + "&locationId=" + locationId;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("License/ActiveOrDeActiveBusinessLocation" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveBusinessLocation:For BusinessId {0} ", BusinessId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }


        [HttpPost]
        public async Task<JsonResult> GetStateCodeByISDCode(int isdCode, int TaxIdentificationId)
        {
            try
            {
                var parameter = "?isdCode=" + isdCode + "&TaxIdentificationId=" + TaxIdentificationId;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_TaxIdentification>("License/GetStateCodeByISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStateCodeByISDCode:For TaxIdentificationId {0}", TaxIdentificationId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStateCodeByISDCode:For TaxIdentificationId {0}", TaxIdentificationId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStateCodeByISDCode:For TaxIdentificationId {0}", TaxIdentificationId);
                throw;
            }
        }

        /// <summary>
        ///Get Business Location Currency for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetCurrencybyBusinessKey(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusienssSegmentCurrency>>("License/GetCurrencybyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencybyBusinessKey:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetCurrencybyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetCurrencybyBusinessKey:For BusinessId {0} BusinessKey", BusinessKey);
                throw;
            }
        }

        /// <summary>
        ///Get Business Unit Type by Entity Id
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessUnitType(int businessId)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_BusinessEntity>("License/GetBusinessUnitType?businessId=" + businessId);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetBusinessUnitType:For businessId {0}", businessId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetBusinessUnitType:For BusinessId {0}", businessId);
                throw;
            }
        }


        /// <summary>
        ///Get Business Location Parameters by Business Key for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLocationParametersbyBusinessKey(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("License/GetLocationParametersbyBusinessKey?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationParametersbyBusinessKey:For BusinessKey {0} BusinessKey", BusinessKey);
                throw;
            }
        }

        /// <summary>
        ///Get State Code by Tax Idendification
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLocationPreferredLanguagebyBusinessKey(int businessId, int BusinessKey)
        {
            try
            {
                var parameter = "?BusinessID=" + businessId + "&BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_LocationPreferredLanguage>>("License/GetLocationPreferredLanguagebyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationPreferredLanguagebyBusinessKey:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationPreferredLanguagebyBusinessKey:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationPreferredLanguagebyBusinessKey:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }


        #endregion

        #region Location Financial Info
        /// <summary>
        /// Get Existing Locations as Segment if IsBookofAccount is checked.
        /// </summary>
        [HttpGet]
        public async Task<JsonResult> GetActiveLocationsAsSegments()
        {
            try
            {
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("License/GetActiveLocationsAsSegments");
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActiveLocationsAsSegments");
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActiveLocationsAsSegments");
                throw;
            }
        }

        /// <summary>
        ///Get Location Financial Info by BusinessKey
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLocationFinancialInfo(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_LocationFinancialInfo>("License/GetLocationFinancialInfo?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationFinancialInfo:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationFinancialInfo:For BusinessKey {0} BusinessKey", BusinessKey);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Location Financial Info
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateLocationFinancialInfo(DO_LocationFinancialInfo obj)
        {
            try
            {

                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdateLocationFinancialInfo", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateBusinessSubscription:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateBusinessSubscription:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region Location Tax Info
        /// <summary>
        ///Get Location Tax Info by BusinessKey
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetLocationLocationTaxInfo(int BusinessKey)
        {
            try
            {

                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<DO_LocationTaxInfo>("License/GetLocationLocationTaxInfo?BusinessKey=" + BusinessKey);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetLocationLocationTaxInfo:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetLocationLocationTaxInfo:For BusinessKey {0} BusinessKey", BusinessKey);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Location Tax Info
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateLocationTaxInfo(DO_LocationTaxInfo obj)
        {
            try
            {

                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalId = AppSessionVariables.GetIPAddress(HttpContext);
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdateLocationTaxInfo", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateLocationTaxInfo:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateLocationTaxInfo:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        #endregion

        #region Payment Method Business Link
        /// <summary>
        ///Payment Method Business Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetPaymentMethodInterfacebyISDCode(int ISDCode, int BusinessKey)
        {
            try
            {
                var parameter = "?ISDCode=" + ISDCode + "&BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.GetAsync<List<DO_PaymentMethodBusinessLink>>("License/GetPaymentMethodInterfacebyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    
                 return Json(serviceResponse.Data);
                    
                    
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPaymentMethodInterfacebyISDCode:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPaymentMethodInterfacebyISDCode:For BusinessKey {0}", BusinessKey);
                throw;
            }
        }

        /// <summary>
        /// Insert or Update Payment Method Business Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePaymentMethodInterfaceBusinessLink(List<DO_PaymentMethodBusinessLink> obj)
        {

            try
            {
               
                    obj.All(c =>
                    {
                        c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                        c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                        c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                        return true;
                    });
                    var serviceResponse = await _eSyaConfigBusinessAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("License/InsertOrUpdatePaymentMethodInterfaceBusinessLink", obj);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePaymentMethodInterfaceBusinessLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion
    }
}
