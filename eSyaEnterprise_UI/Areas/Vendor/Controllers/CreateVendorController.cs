using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using eSyaEnterprise_UI.Areas.ProductSetup.Data;
using eSyaEnterprise_UI.Areas.Vendor.Data;
using eSyaEnterprise_UI.Areas.Vendor.Models;
using eSyaEnterprise_UI.Utility;
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

namespace eSyaEnterprise_UI.Areas.Vendor.Controllers
{
    [SessionTimeout]
    public class CreateVendorController : Controller
    {
        private readonly IeSyaVendorAPIServices _eSyaVendorAPIServices;
        private readonly IeSyaProductSetupAPIServices _eSyaProductSetupAPIServices;
        private readonly ILogger<CreateVendorController> _logger;


        public CreateVendorController(IeSyaVendorAPIServices eSyaVendorAPIServices, IeSyaProductSetupAPIServices eSyaProductSetupAPIServices, ILogger<CreateVendorController> logger)
        {
            _eSyaVendorAPIServices = eSyaVendorAPIServices;
            _eSyaProductSetupAPIServices = eSyaProductSetupAPIServices;
            _logger = logger;
        }

        #region Manage Vendor
        [Area("Vendor")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EVN_01_00()
        {
            try
            {
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Vendor/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.VendorClass);
                var servicepayment = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Vendor/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.PaymentPreferredMode);

                if (serviceResponse.Status && servicepayment.Status)
                {
                    ViewBag.VendorClass = serviceResponse.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();
                    ViewBag.PaymentPreferredMode = servicepayment.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();
                    return View();
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetApplicationCodesByCodeType");
                    return Json(new { Status = false, StatusCode = "500" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetApplicationCodesByCodeType");
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [Area("Vendor")]
        public IActionResult _VendorDetails()
        {
            return View();
        }


        [Area("Vendor")]
        public IActionResult _VendorLocations()
        {
            return View();
        }

        [Area("Vendor")]
        public IActionResult _VendorBusinessLink()
        {
            return View();
        }

        [Area("Vendor")]
        public IActionResult _StatutoryDetails()
        {
            return View();
        }
        [Area("Vendor")]
        public IActionResult _BankDetails()
        {
            return View();
        }

        [Area("Vendor")]
        public IActionResult _ItemLink()
        {
            return View();
        }

        [Area("Vendor")]
        public IActionResult _PartNumber()
        {
            return View();
        }

        [Area("Vendor")]
        public IActionResult _SupplyGroup()
        {
            return View();
        }
        /// <summary>
        ///Get Vendor for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendors(string Alphabet)
        {
            try
            {
                var parameter = "?Alphabet=" + Alphabet;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorRegistration>>("Vendor/GetVendors" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendors:For Alphabet {0}", Alphabet);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendors:For Alphabet {0} ", Alphabet);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        ///Get Vendor SupplyGroup Parameter List by Vendor Code
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorParameterList(int vendorID)
        {
            try
            {
                var parameter = "?vendorID=" + vendorID;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("Vendor/GetVendorParameterList" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorParameterList:For vendorID {0} ", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorParameterList:For vendorID {0} ", vendorID);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Vendor.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateVendor(DO_VendorRegistration vendor)
        {

            try
            {
                vendor.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                vendor.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                vendor.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertOrUpdateVendor", vendor);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateVendor:params:" + JsonConvert.SerializeObject(vendor));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        /// <summary>
        /// Activate or De Activate Vendor
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> ActiveOrDeActiveVendor(bool status, int vendorID)
        {

            try
            {

                var parameter = "?status=" + status + "&vendorID=" + vendorID;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<DO_ReturnParameter>("Vendor/ActiveOrDeActiveVendor" + parameter);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActiveVendor:For vendorID {0} ", vendorID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
        #endregion

        #region Vendor Location

        /// <summary>
        ///Get States by isdCode
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStatesbyISDCode(int isdCode)
        {
            try
            {
                var parameter = "?isdCode=" + isdCode;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_States>>("Vendor/GetStatesbyISDCode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatesbyISDCode:For vendorcode {0}", isdCode);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStatesbyISDCode:For vendorcode {0} ", isdCode);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        ///Get Vendor Locationsby Vendor code for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorLocationsByVendorcode(int vendorID)
        {
            try
            {
                var parameter = "?vendorID=" + vendorID;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorLocation>>("Vendor/GetVendorLocationsByVendorcode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorLocationsByVendorcode:For vendorID {0}", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorLocationsByVendorcode:For vendorID {0} ", vendorID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Vendor Location.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateVendorLocation(DO_VendorLocation vendorloc)
        {

            try
            {
                vendorloc.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                vendorloc.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                vendorloc.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertOrUpdateVendorLocation", vendorloc);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateVendorLocation:params:" + JsonConvert.SerializeObject(vendorloc));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Vendor Location

        #region Vendor Business Key
        /// <summary>
        ///Get Vendor BusinessKeysByVendor for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetBusinessKeysByVendorcode(int vendorID)
        {
            try
            {

                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_BusinessKey>>("Vendor/GetBusinessLocation");
                List<DO_BusinessKey> blocations = serviceResponse.Data;
                var parameter = "?vendorID=" + vendorID;
                var serviceResp = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorBusinessLink>>("Vendor/GetBusinessKeysByVendorcode" + parameter);
                List<DO_VendorBusinessLink> businesskeydata = serviceResp.Data;

                if (serviceResponse.Status && serviceResp.Status)
                {
                    foreach (var obj in blocations)
                    {
                        if (vendorID != 0)
                        {
                            if (businesskeydata.Count > 0)
                            {
                                var isBusinessSegment = businesskeydata
                                      .Where(c => c.VendorId == vendorID && c.BusinessKey == obj.BusinessKey).FirstOrDefault();

                                if (isBusinessSegment != null)
                                {
                                    obj.ActiveStatus = true;
                                }
                                else
                                {
                                    obj.ActiveStatus = false;
                                }

                            }
                        }
                    }
                    return Json(blocations);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResp.Message), "UD:GetBusinessKeysByVendorcode:For vendorcode {0} ", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }



            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorLocationsByVendorcode:For vendorcode {0} ", vendorID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert Business Keys.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertBusinesskeyforVendor(DO_VendorBusinessLink bkeys)
        {

            try
            {
                bkeys.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                bkeys.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                bkeys.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);

                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertBusinesskeyforVendor", bkeys);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertBusinesskeyforVendor:params:" + JsonConvert.SerializeObject(bkeys));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Vendor Business Key

        #region Vendor Statutory Details need to remove
        /// <summary>
        ///Get Vendor Statutory details by Vendor code and LocationId for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetStatutorydetailsbyVendorcodeAndLocationId(int vendorID, int locationId)
        {
            try
            {
                var parameter = "?vendorID=" + vendorID + "&locationId=" + locationId;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorStatutoryDetails>>("Vendor/GetStatutorydetailsbyVendorcodeAndLocationId" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetStatutorydetailsbyVendorcodeAndLocationId:For vendorID {0} with locationId entered {1}", vendorID, locationId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetStatutorydetailsbyVendorcodeAndLocationId:For vendorID {0} with locationId entered {1}", vendorID, locationId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Vendor Statutory details.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateStatutorydetails(DO_VendorStatutoryDetails statutorydetails)
        {

            try
            {
                statutorydetails.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                statutorydetails.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                statutorydetails.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertOrUpdateStatutorydetails", statutorydetails);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateStatutorydetails:params:" + JsonConvert.SerializeObject(statutorydetails));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Vendor Statutory details

        #region Vendor Statutory Details
        ///Get Vendor Addrress Location dropdown
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorAddressLocationsByVendorID(int vendorID)
        {
            try
            {
                var parameter = "?vendorID=" + vendorID;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorLocation>>("Vendor/GetVendorAddressLocationsByVendorID" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorAddressLocationsByVendorID:For VendorId", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorAddressLocationsByVendorID:For VendorId", vendorID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        ///Get Vendor Business Linkked Locations ISD Codes dropdown
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetISDCodesbyVendorId(int vendorID)
        {
            try
            {
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_CountryISDCodes>>("Vendor/GetISDCodesbyVendorId?vendorID=" + vendorID);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data.Count > 0)
                    {
                        foreach (var i in serviceResponse.Data)
                        {

                            //i.CountryName = "<div  style=\"float: left;\"><img src='" + this.Request.PathBase + '/' + i.CountryFlag + "'/></div>" + '(' + '+' + i.Isdcode + ')' + i.CountryName;
                            i.CountryFlag = this.Request.PathBase + "/" + i.CountryFlag;
                            i.CountryName = i.CountryName;
                            i.Isdcode = i.Isdcode;

                        }
                        var res = serviceResponse.Data.GroupBy(x => x.Isdcode).Select(y => y.First()).Distinct();
                        return Json(res);

                    }
                    else
                    {
                        return Json(serviceResponse.Data);
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetISDCodesbyVendorId:For businessKey ", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetISDCodesbyVendorId:For isdCode ", vendorID);
                throw ex;
            }
        }

        /// <summary>
        ///Get Vendor Statutory details by Vendor code and LocationId for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorStatutoryDetails(int vendorID, int isdCode, int locationId)
        {
            try
            {
                var parameter = "?vendorID=" + vendorID + "&isdCode="+ isdCode + "&locationId=" + locationId;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorStatutoryDetails>>("Vendor/GetVendorStatutoryDetails" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorStatutoryDetails:For vendorID {0} with locationId entered {1}", vendorID, locationId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorStatutoryDetails:For vendorID {0} with locationId entered {1}", vendorID, locationId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }
        /// <summary>
        /// Insert Into Doctor Statutory details
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateVendorStatutoryDetails(List<DO_VendorStatutoryDetails> obj)
        {
            try
            {
                obj.All(c =>
                {
                    c.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    c.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    c.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext).ToString();
                    return true;
                });

                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertOrUpdateVendorStatutoryDetails", obj);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertOrUpdateVendorStatutoryDetails:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateVendorStatutoryDetails:params:" + JsonConvert.SerializeObject(obj));
                throw ex;
            }
        }
        #endregion

        #region Vendor Bank Details
        /// <summary>
        ///Get Vendor Bank Details for Grid
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorBankdetailsByVendorcode(int VendorId)
        {
            try
            {
                var parameter = "?VendorId=" + VendorId;
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_VendorBankdetails>>("Vendor/GetVendorBankdetailsByVendorcode" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorBankdetailsByVendorcode:For VendorId", VendorId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorBankdetailsByVendorcode:For VendorId", VendorId);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }

        }

        /// <summary>
        /// Insert or Update Vendor Bank details.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateVendorBankdetails(DO_VendorBankdetails bankdetails)
        {

            try
            {
                bankdetails.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                bankdetails.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                bankdetails.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                if (bankdetails.IsEdit == 1)
                {
                    var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/UpdateVendorBankdetails", bankdetails);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }
                else
                {
                    var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertVendorBankdetails", bankdetails);
                    if (serviceResponse.Status)
                        return Json(serviceResponse.Data);
                    else
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateVendorBankdetails:params:" + JsonConvert.SerializeObject(bankdetails));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Vendor Bank Details


        #region Vendor Supply Group
        /// <summary>
        ///Get Vendor SupplyGroup Parameter List by Vendor Code
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorSuuplyGroupParameterList(int vendorID)
        {
            try
            {
                string subledgertype = "S";
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_Parameters>>("Vendor/GetVendorSuuplyGroupSubledgerType?subledgertype=" + subledgertype);
                List<DO_Parameters> par_master = serviceResponse.Data;
                var parameter = "?vendorID=" + vendorID;
                var serviceResp = await _eSyaVendorAPIServices.HttpClientServices.GetAsync<List<DO_eSyaParameter>>("Vendor/GetVendorSuuplyGroupParameterList" + parameter);
                List<DO_eSyaParameter> supplygroupdata = serviceResp.Data;

                if (serviceResponse.Status && serviceResp.Status)
                {
                    foreach (var obj in par_master)
                    {
                        if (vendorID != 0)
                        {
                            if (supplygroupdata.Count > 0)
                            {
                                var islinked = supplygroupdata
                                      .Where(c => c.VendorId == vendorID && c.ParameterID == obj.ParameterId).FirstOrDefault();

                                if (islinked != null)
                                {
                                    obj.ActiveStatus = true;
                                }
                                else
                                {
                                    obj.ActiveStatus = false;
                                }

                            }
                            else
                            {
                                obj.ActiveStatus = false;
                            }
                        }
                        else
                        {
                            obj.ActiveStatus = false;
                        }
                    }
                    return Json(par_master);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResp.Message), "UD:GetBusinessKeysByVendorcode:For vendorcode {0} ", vendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }



            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorLocationsByVendorcode:For vendorcode {0} ", vendorID);
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Insert Business Keys.
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertSuuplyGroupforVendor(DO_VendorSupplyGroup objsupply)
        {

            try
            {
                objsupply.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                objsupply.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                objsupply.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                var serviceResponse = await _eSyaVendorAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Vendor/InsertSuuplyGroupforVendor", objsupply);
                if (serviceResponse.Status)
                    return Json(serviceResponse.Data);
                else
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertSuuplyGroupforVendor:params:" + JsonConvert.SerializeObject(objsupply));
                return Json(new { Status = false, Message = ex.InnerException == null ? ex.Message.ToString() : ex.InnerException.Message });
            }
        }
        #endregion Vendor Supply Group
    }
}
