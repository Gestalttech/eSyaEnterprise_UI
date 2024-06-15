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
    public class RateContractController : Controller
    {
        private readonly IeSyaPharmaAPIServices _eSyaPharmaAPIServices;
        private readonly ILogger<DrugBrandsController> _logger;
        public RateContractController(IeSyaPharmaAPIServices eSyaPharmaAPIServices, ILogger<DrugBrandsController> logger)
        {
            _eSyaPharmaAPIServices = eSyaPharmaAPIServices;
            _logger = logger;
        }

        [Area("ManagePharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMP_02_00()
        {
            var responseBK = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("Common/GetBusinessKey");
            var responseMF = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugComposition>>("Common/GetManufacturersList");

            if (responseBK.Status && responseMF.Status)
            {
                if (responseBK.Data != null)
                {
                    ViewBag.BusinessLocation = responseBK.Data.Select(a => new SelectListItem
                    {
                        Text = a.LocationDescription,
                        Value = a.BusinessKey.ToString()
                    });
                }

                if (responseMF.Data != null)
                {
                    ViewBag.Manufacturer = responseMF.Data.Select(a => new SelectListItem
                    {
                        Text = a.ManufacturerName,
                        Value = a.ManufacturerId.ToString()
                    });
                }
            }
            ViewBag.formName = "Drug Manufacturer Link";
            return View();
        }

        /// <summary>
        ///Get Drug Manufacturer List
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDrugManufacturerLink(int BusinessKey, int ManufacturerID)
        {
            try
            {

                var parameter = "?BusinessKey=" + BusinessKey + "&ManufacturerID=" + ManufacturerID;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugManufacturerLink>>("DrugBrands/GetDrugManufacturerLink" + parameter);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugManufacturerLink:For BusinessKey {0} ManufacturerID {1}", BusinessKey, ManufacturerID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugManufacturerLink:For BusinessKey {0} ManufacturerID {1}", BusinessKey, ManufacturerID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugManufacturerLink:For BusinessKey {0} ManufacturerID {1}", BusinessKey, ManufacturerID);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Drug Manufacturer Link
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> AddOrUpdateDrugManufacturer(List<DO_DrugManufacturerLink> obj)
        {
            try
            {
                foreach (var ser_br in obj)
                {
                    ser_br.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    ser_br.CreatedOn = DateTime.Now;
                    ser_br.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    ser_br.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                }


                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugBrands/AddOrUpdateDrugManufacturer", obj);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateDrugManufacturer:params:" + JsonConvert.SerializeObject(obj));
                        return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                    }

                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:AddOrUpdateDrugManufacturer:params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:AddOrUpdateDrugManufacturer:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
    }
}

