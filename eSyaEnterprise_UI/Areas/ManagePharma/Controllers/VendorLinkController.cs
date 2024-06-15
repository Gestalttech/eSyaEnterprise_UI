using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManagePharma.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.Areas.ManagePharma.Models;
using eSyaEnterprise_UI.Models;
using eSyaEssentials_UI;
using eSyaEnterprise_UI.Utility;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    [SessionTimeout]
    public class VendorLinkController : Controller
    {
        private readonly IeSyaPharmaAPIServices _eSyaPharmaAPIServices;
        private readonly ILogger<VendorLinkController> _logger;
        public VendorLinkController(IeSyaPharmaAPIServices eSyaPharmaAPIServices, ILogger<VendorLinkController> logger)
        {
            _eSyaPharmaAPIServices = eSyaPharmaAPIServices;
            _logger = logger;
        }

        [Area("ManagePharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMP_03_00()
        {
            var responseBK = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Common/GetBusinessKey");

            if (responseBK.Status)
            {
                if (responseBK.Data != null)
                {
                    ViewBag.BusinessLocation = responseBK.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                }
            }
            ViewBag.formName = "Drug Vendor Link";

            return View();
        }

        /// <summary>
        ///Get Drug Vendor Link
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetVendorList(int BusinessKey)
        {
            try
            {
                var parameter = "?BusinessKey=" + BusinessKey;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugVendorLink>>("Common/GetVendorList" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorList:For BusinessKey {0}", BusinessKey);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetVendorList:For BusinessKey {0}", BusinessKey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetVendorList:For BusinessKey {0}", BusinessKey);
                throw ex;
            }
        }

        /// <summary>
        ///Get Drug Vendor List
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDrugVendorLink(int BusinessKey, int VendorID)
        {
            try
            {

                var parameter = "?BusinessKey=" + BusinessKey + "&VendorID=" + VendorID;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugVendorLink>>("DrugBrands/GetDrugVendorLink" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugVendorLink:For BusinessKey {0} VendorID {1}", BusinessKey, VendorID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugVendorLink:For BusinessKey {0} VendorID {1}", BusinessKey, VendorID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugVendorLink:For BusinessKey {0} VendorID {1}", BusinessKey, VendorID);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Drug Vendor Link
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> AddOrUpdateDrugVendorLink(List<DO_DrugVendorLink> obj)
        {
            try
            {
                foreach (var ser_br in obj)
                {
                    if (string.IsNullOrEmpty(ser_br.BusinessKey.ToString()) || ser_br.BusinessKey == 0)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Business Location" });
                    }
                    if (string.IsNullOrEmpty(ser_br.VendorID.ToString()) || ser_br.VendorID == 0)
                    {
                        return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Vendor" });
                    }

                    ser_br.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    ser_br.CreatedOn = DateTime.Now;
                    ser_br.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    ser_br.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugBrands/AddOrUpdateDrugVendorLink", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateDrugVendorLink:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateDrugVendorLink:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateDrugVendorLink:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
    }
}
