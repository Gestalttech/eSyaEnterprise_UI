using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ManagePharma.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.Areas.ManagePharma.Models;
using eSyaEnterprise_UI.Models;
using eSyaEssentials_UI;
using eSyaEnterprise_UI.Utility;
using Newtonsoft.Json;
using eSyaEnterprise_UI.ApplicationCodeTypes;

namespace eSyaEnterprise_UI.Areas.ManagePharma.Controllers
{
    [SessionTimeout]
    public class DrugBrandsController : Controller
    {
        private readonly IeSyaPharmaAPIServices _eSyaPharmaAPIServices;
        private readonly ILogger<DrugBrandsController> _logger;

        public DrugBrandsController(IeSyaPharmaAPIServices eSyaPharmaAPIServices, ILogger<DrugBrandsController> logger)
        {
            _eSyaPharmaAPIServices = eSyaPharmaAPIServices;
            _logger = logger;
        }

        #region Drug Brands
        [Area("ManagePharma")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EMP_01_00()
        {
            //var responseISD = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_CountryCodes>>("Common/GetISDCodes");
            var responseDB = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugBrands>>("DrugBrands/GetDrugBrandList");
            var responseDC = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugComposition>>("Common/GetComposition");
            var responsePK = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_ApplicationCodes>>("Common/GetApplicationCodesByCodeType?codeType=" + ApplicationCodeTypeValues.DrugPacking);

            if (responseDB.Status && responseDC.Status && responsePK.Status)//&& responseISD.Status
            {
                if (responseDB.Data != null)
                {
                    ViewBag.DrugList = responseDB.Data.Select(a => new SelectListItem
                    {
                        Text = a.TradeName,
                        Value = a.TradeID.ToString()
                    });
                }

                if (responseDC.Data != null)
                {
                    ViewBag.DrugCompositionList = responseDC.Data.Select(a => new SelectListItem
                    {
                        Text = a.DrugCompDesc,
                        Value = a.CompositionId.ToString()
                    });
                }

                if (responsePK.Data != null)
                {
                    ViewBag.Packing = responsePK.Data.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();
                }

                //if (responseISD.Data != null)
                //{
                //    ViewBag.IsdCodes = responseISD.Data.Select(b => new SelectListItem
                //    {
                //        Value = b.Isdcode.ToString(),
                //        Text = b.CountryName,
                //    }).ToList();
                //}
            }

            ViewBag.formName = "Drug Brands";
            return View();
        }

        /// <summary>
        ///Get Drug Formulation
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDrugFormulation(int CompositionId)
        {
            try
            {
                var parameter = "?CompositionId=" + CompositionId;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugComposition>>("Common/GetDrugFormulation" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugFormulation:For ItemGroup {0}", CompositionId);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugFormulation:For ItemGroup {0}", CompositionId);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugFormulation:For ItemGroup {0}", CompositionId);
                throw ex;
            }
        }

        /// <summary>
        ///Get Manufacturers
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetManufacturers(int CompositionId, int FormulationID)
        {
            try
            {
                var parameter = "?CompositionId=" + CompositionId + "&FormulationID=" + FormulationID;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugComposition>>("Common/GetManufacturers" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetManufacturers:For CompositionId {0} FormulationID {1}", CompositionId, FormulationID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetManufacturers:For CompositionId {0} FormulationID {1}", CompositionId, FormulationID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetManufacturers:For CompositionId {0} FormulationID {1}", CompositionId, FormulationID);
                throw ex;
            }
        }

        /// <summary>
        ///Get Drug Brand List By Trade ID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDrugBrandListByTradeID(int TradeID)
        {
            try
            {
                var parameter = "?TradeID=" + TradeID;
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugBrands>>("DrugBrands/GetDrugBrandListByTradeID" + parameter);
                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByTradeID:For TradeID {0}", TradeID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByTradeID:For TradeID {0}", TradeID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugBrandListByTradeID:For ItemGroup {0}", TradeID);
                throw ex;
                //return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        /// <summary>
        /// Get Drug Brands parameter
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GetDrugBrandParameterList(int TradeID)
        {
            try
            {
                var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<DO_DrugBrands>("DrugBrands/GetDrugBrandParameterList?TradeID=" + TradeID);

                if (serviceResponse.Status)
                {
                    if (serviceResponse.Data != null)
                    {
                        return Json(serviceResponse.Data);
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandParameterList:For TradeID {0}", TradeID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandParameterList:For TradeID {0}", TradeID);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugBrandParameterList:For TradeID {0}", TradeID);
                throw ex;
            }
        }

        /// <summary>
        ///Get Drug Brand List By Trade ID
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> GetDrugBrandListByGroup(int CompositionID, int FormulationID, int ManufacturerID)
        {
            try
            {
                if (ManufacturerID == 0 && FormulationID == 0 && ManufacturerID == 0)
                {
                    var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugBrands>>("DrugBrands/GetFullDrugBrandList");
                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByGroup");
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByGroup");
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                else
                {
                    var parameter = "?CompositionID=" + CompositionID + "&FormulationID=" + FormulationID + "&ManufacturerID=" + ManufacturerID;
                    var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.GetAsync<List<DO_DrugBrands>>("DrugBrands/GetDrugBrandListByGroup" + parameter);

                    if (serviceResponse.Status)
                    {
                        if (serviceResponse.Data != null)
                        {
                            return Json(serviceResponse.Data);
                        }
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByGroup:For CompositionID {0} FormulationID {1} with ManufacturerID {2}", CompositionID, FormulationID, ManufacturerID);
                            return Json(new { Status = false, StatusCode = "500" });
                        }
                    }
                    else
                    {
                        _logger.LogError(new Exception(serviceResponse.Message), "UD:GetDrugBrandListByGroup:For CompositionID {0} FormulationID {1} with ManufacturerID {2}", CompositionID, FormulationID, ManufacturerID);
                        return Json(new { Status = false, StatusCode = "500" });
                    }
                }
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetDrugBrandListByGroup:For CompositionID {0} FormulationID {1} with ManufacturerID {2}", CompositionID, FormulationID, ManufacturerID);
                throw ex;
            }
        }

        /// <summary>
        /// Insert or Update Item Codes
        /// </summary>
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdateDrugBrands(DO_DrugBrands obj)
        {
            try
            {
                if (string.IsNullOrEmpty(obj.CompositionID.ToString()) || obj.CompositionID == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Drug Composition" });
                }
                else if (string.IsNullOrEmpty(obj.FormulationID.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Formulation" });
                }
                else if (string.IsNullOrEmpty(obj.ManufacturerID.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Manufacturer" });
                }
                else if (string.IsNullOrEmpty(obj.TradeName))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Trade Name" });
                }
                else if (string.IsNullOrEmpty(obj.Packing.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Packing" });
                }
                else if (string.IsNullOrEmpty(obj.PackSize.ToString()) || obj.PackSize == 0)
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Enter Pack Size" });
                }
                else if (string.IsNullOrEmpty(obj.ISDCode.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select ISD Code" });
                }
                else if (string.IsNullOrEmpty(obj.BarcodeID.ToString()))
                {
                    return Json(new DO_ReturnParameter() { Status = false, Message = "Please Select Barcode Id" });
                }
                
                else
                {
                    obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);

                    obj.Skutype = "D";
                    if (obj.TradeID == 0)
                    {
                        var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugBrands/InsertDrugBrands", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertDrugBrands:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = await _eSyaPharmaAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("DrugBrands/UpdateDrugBrands", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdateDrugBrands:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdateDrugBrands:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }

        #endregion Drug Brands
    }
}
