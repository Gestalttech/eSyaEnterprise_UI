using eSyaEnterprise_UI.ActionFilter;
using eSyaEnterprise_UI.Areas.ConfigPatient.Data;
using eSyaEnterprise_UI.Areas.ConfigPatient.Models;
using eSyaEssentials_UI;
using eSyaEnterprise_UI.Models;
using eSyaEnterprise_UI.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using eSyaEnterprise_UI.ApplicationCodeTypes;
using Newtonsoft.Json;

namespace eSyaEnterprise_UI.Areas.ConfigPatient.Controllers
{
    [SessionTimeout]
    public class DiscountController : Controller
    {
        private readonly IeSyaConfigPatientAPIServices _eSyaConfigPatientAPIServices;
        private readonly ILogger<DiscountController> _logger;
        public DiscountController(IeSyaConfigPatientAPIServices patientManagementAPIServices, ILogger<DiscountController> logger)
        {
            _eSyaConfigPatientAPIServices = patientManagementAPIServices;
            _logger = logger;
        }

        #region Manage Patient Category Discounts
        [Area("ConfigPatient")]
        [ServiceFilter(typeof(ViewBagActionFilter))]
        public async Task<IActionResult> EPM_07_00()
        {
            try
            {
                List<int> l_codeType = new List<int>();
                l_codeType.Add(ApplicationCodeTypeValues.DiscountFor);
                l_codeType.Add(ApplicationCodeTypeValues.DiscountAt);

                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_BusinessLocation>>("CommonMethod/GetBusinessKey");
                var appresponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<List<DO_ApplicationCodes>>("CommonMethod/GetApplicationCodesByCodeTypeList", l_codeType);


                if (serviceResponse.Status && appresponse.Status)
                {
                    List<DO_ApplicationCodes> DiscountFor = appresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.DiscountFor).ToList();
                    List<DO_ApplicationCodes> DiscountAt = appresponse.Data.Where(x => x.CodeType == ApplicationCodeTypeValues.DiscountAt).ToList();

                    ViewBag.BusinessKeyList = serviceResponse.Data.Select(a => new SelectListItem
                    {
                        Value = a.BusinessKey.ToString(),
                        Text = a.LocationDescription.ToString()
                    });

                    ViewBag.DiscountForList = DiscountFor.Select(b => new SelectListItem
                    {
                        Value = b.ApplicationCode.ToString(),
                        Text = b.CodeDesc,
                    }).ToList();

                    ViewBag.DiscountAtList = DiscountAt.Select(c => new SelectListItem
                    {
                        Value = c.ApplicationCode.ToString(),
                        Text = c.CodeDesc,
                    }).ToList();
                }
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActivePatientTypes");
                return Json(new DO_ResponseParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpGet]
        public async Task<JsonResult> GetActivePatientCategoriesbyBusinessKey(int businesskey)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientCategoryDiscount>>("Discount/GetActivePatientCategoriesbyBusinessKey" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetActivePatientCategoriesbyBusinessKey:For businesskey {0} ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetActivePatientCategoriesbyBusinessKey:For businesskey {0} ", businesskey);
                throw ex;
            }
        }
        [HttpGet]
        public async Task<JsonResult> GetPatientCategoryDiscountbyDiscountAt(int businesskey, int patientcategoryId, int discountfor, bool serviceclass)
        {
            try
            {
                var parameter = "?businesskey=" + businesskey + "&patientcategoryId=" + patientcategoryId + "&discountfor=" + discountfor
                    + "&serviceclass=" + serviceclass;
                var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.GetAsync<List<DO_PatientCategoryDiscount>>("Discount/GetPatientCategoryDiscountbyDiscountAt" + parameter);
                if (serviceResponse.Status)
                {
                    return Json(serviceResponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(serviceResponse.Message), "UD:GetPatientCategoryDiscountbyDiscountAt:For businesskey {0} ", businesskey);
                    return Json(new { Status = false, StatusCode = "500" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientCategoryDiscountbyDiscountAt:For businesskey {0} ", businesskey);
                throw ex;
            }
        }
        [HttpPost]
        public async Task<JsonResult> InsertOrUpdatePatientCategoryDiscount(bool isinsert, DO_PatientCategoryDiscount obj)
        {
            try
            {
                if (obj.DiscountAt == 650001)
                {
                    obj.serviceclass = true;
                }
                else
                {
                    obj.serviceclass = false;
                }
                    obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    if (isinsert)
                    {
                        var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Discount/InsertPatientCategoryDiscount", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:InsertPatientCategoryDiscount:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }
                    else
                    {
                        var serviceResponse = await _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Discount/UpdatePatientCategoryDiscount", obj);
                        if (serviceResponse.Status)
                            return Json(serviceResponse.Data);
                        else
                        {
                            _logger.LogError(new Exception(serviceResponse.Message), "UD:UpdatePatientCategoryDiscount:params:" + JsonConvert.SerializeObject(obj));
                            return Json(new DO_ReturnParameter() { Status = false, Message = serviceResponse.Message });
                        }
                    }

                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:InsertOrUpdatePatientCategoryDiscount:params:" + JsonConvert.SerializeObject(obj));
                return Json(new { Status = false, Message = ex.ToString() });
            }
        }
        [HttpPost]
        public JsonResult GetPatientPatientCategoryDiscountInfo(DO_PatientCategoryDiscount obj)
        {
            try
            {

              
                    obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                    obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                    obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);
                

                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Discount/GetPatientPatientCategoryDiscountInfo", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:GetPatientPatientCategoryDiscountInfo:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:GetPatientPatientCategoryDiscountInfo:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }

        [HttpPost]
        public JsonResult ActiveOrDeActivePatientCategoryDiscount(bool status, DO_PatientCategoryDiscount obj)
        {
            try
            {


                obj.UserID = AppSessionVariables.GetSessionUserID(HttpContext);
                obj.TerminalID = AppSessionVariables.GetIPAddress(HttpContext);
                obj.FormID = AppSessionVariables.GetSessionFormInternalID(HttpContext);


                var Insertresponse = _eSyaConfigPatientAPIServices.HttpClientServices.PostAsJsonAsync<DO_ReturnParameter>("Discount/ActiveOrDeActivePatientCategoryDiscount", obj).Result;
                if (Insertresponse.Status)
                {
                    return Json(Insertresponse.Data);
                }
                else
                {
                    _logger.LogError(new Exception(Insertresponse.Message), "UD:ActiveOrDeActivePatientCategoryDiscount:Params:" + JsonConvert.SerializeObject(obj));
                    return Json(new DO_ReturnParameter() { Status = false, Message = Insertresponse.Message });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UD:ActiveOrDeActivePatientCategoryDiscount:Params:" + JsonConvert.SerializeObject(obj));
                return Json(new DO_ReturnParameter() { Status = false, Message = (ex.InnerException != null) ? ex.InnerException.Message : ex.Message });
            }
        }
    }
    #endregion
}

